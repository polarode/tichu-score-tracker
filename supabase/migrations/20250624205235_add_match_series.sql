-- Create match_series table
CREATE TABLE IF NOT EXISTS public.match_series (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    target_points integer NOT NULL,
    status character varying NOT NULL DEFAULT 'active',
    winning_team integer NULL,
    CONSTRAINT match_series_pkey PRIMARY KEY (id),
    CONSTRAINT match_series_status_check CHECK (status IN ('active', 'completed')),
    CONSTRAINT match_series_winning_team_check CHECK (winning_team IN (1, 2))
);

-- Create match_participants table
CREATE TABLE IF NOT EXISTS public.match_participants (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    match_id uuid NOT NULL,
    player_id uuid NOT NULL,
    team integer NOT NULL,
    CONSTRAINT match_participants_pkey PRIMARY KEY (id),
    CONSTRAINT match_participants_match_id_fkey FOREIGN KEY (match_id) REFERENCES match_series(id) ON DELETE CASCADE,
    CONSTRAINT match_participants_player_id_fkey FOREIGN KEY (player_id) REFERENCES players(id),
    CONSTRAINT match_participants_team_check CHECK (team IN (1, 2))
);

-- Add match_id to games table
ALTER TABLE public.games ADD COLUMN match_id uuid NULL;
ALTER TABLE public.games ADD CONSTRAINT games_match_id_fkey FOREIGN KEY (match_id) REFERENCES match_series(id) ON DELETE SET NULL;

-- Function to get match standings
CREATE OR REPLACE FUNCTION get_match_standings(p_match_id uuid)
RETURNS TABLE(team integer, total_score bigint, game_count integer)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gs.team::integer,
        COALESCE(SUM(gs.total_score::integer), 0) as total_score,
        COUNT(g.id)::integer as game_count
    FROM games g
    JOIN game_scores gs ON g.id = gs.game_id
    WHERE g.match_id = p_match_id
    GROUP BY gs.team
    ORDER BY gs.team;
END;
$$;

-- Function to create match series
CREATE OR REPLACE FUNCTION create_match_series(
    p_target_points integer,
    p_team1_players uuid[],
    p_team2_players uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    v_match_id uuid;
    v_player_id uuid;
BEGIN
    -- Create match series
    INSERT INTO match_series (target_points)
    VALUES (p_target_points)
    RETURNING id INTO v_match_id;
    
    -- Add team 1 participants
    FOREACH v_player_id IN ARRAY p_team1_players
    LOOP
        INSERT INTO match_participants (match_id, player_id, team)
        VALUES (v_match_id, v_player_id, 1);
    END LOOP;
    
    -- Add team 2 participants
    FOREACH v_player_id IN ARRAY p_team2_players
    LOOP
        INSERT INTO match_participants (match_id, player_id, team)
        VALUES (v_match_id, v_player_id, 2);
    END LOOP;
    
    RETURN v_match_id;
END;
$$;

-- Update existing insert_tichu_game function to handle match_id and beschiss
CREATE OR REPLACE FUNCTION insert_tichu_game(
  p_players uuid[],
  p_teams int[],
  p_positions int[],
  p_tichu_calls text[],
  p_bomb_count int[],
  p_double_wins boolean[],
  p_scores int[],
  p_total_scores int[],
  p_timestamp timestamptz default now(),
  p_match_id uuid default null,
  p_beschiss boolean default false
)
returns uuid
language plpgsql
as $$
declare
  v_small_tichu boolean[] := '{}';
  v_grand_tichu boolean[] := '{}';
  v_tichu_success boolean[] := '{}';
  v_team1_score int := 0;
  v_team2_score int := 0;
  v_team_scores jsonb;
  v_game_id uuid;
  v_first_idx int;
  v_second_idx int;
begin
  -- Validate input
  if array_length(p_players, 1) != 4
    or array_length(p_teams, 1) != 4
    or array_length(p_positions, 1) != 4
    or array_length(p_tichu_calls, 1) != 4
    or array_length(p_bomb_count, 1) != 4
    or array_length(p_double_wins, 1) != 2
    or array_length(p_scores, 1) != 2
    or array_length(p_total_scores, 1) != 2 then
    raise exception 'Input arrays must all have the correct lenght';
  end if;

  -- Detect tichu success
  for i in 1..4 loop
    v_small_tichu := array_append(v_small_tichu, p_tichu_calls[i] = 'ST');
    v_grand_tichu := array_append(v_grand_tichu, p_tichu_calls[i] = 'GT');
    if v_small_tichu[i] or v_grand_tichu[i] then
      if p_positions[i] = 1 then
        v_tichu_success := array_append(v_tichu_success, true);
      else
        v_tichu_success := array_append(v_tichu_success, false);
      end if;
    else
      v_tichu_success := array_append(v_tichu_success, false);
    end if;
  end loop;

  -- Create a new game
  insert into games (timestamp, match_id)
  values (p_timestamp, p_match_id)
  returning id into v_game_id;

  -- Insert game participants
  for i in 1..4 loop
    insert into game_participants (game_id, player_id, team, position, tichu_call, grand_tichu_call, tichu_success, bomb_count)
    values (v_game_id, p_players[i], p_teams[i],  p_positions[i], v_small_tichu[i], v_grand_tichu[i], v_tichu_success[i], p_bomb_count[i]);
  end loop;

  -- Insert game scores
  for i in 1..2 loop
    insert into game_scores (game_id, team, score, double_win, total_score)
    values (v_game_id, i, p_scores[i], p_double_wins[i], p_total_scores[i]);
  end loop;

  return v_game_id;
end;
$$;