-- Add beschiss column to games table
ALTER TABLE public.games
    ADD COLUMN beschiss boolean NOT NULL DEFAULT false;

-- Update the insert_tichu_game function to include the beschiss parameter
CREATE OR REPLACE FUNCTION insert_tichu_game(
  p_players uuid[],
  p_teams int[],
  p_positions int[],
  p_tichu_calls text[],
  p_bomb_count int[],
  p_double_wins boolean[],
  p_scores int[],
  p_total_scores int[],
  p_beschiss boolean DEFAULT false,
  p_timestamp timestamptz DEFAULT now()
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
v_small_tichu boolean[] := '{}';
  v_grand_tichu boolean[] := '{}';
  v_tichu_success boolean[] := '{}';
  v_team1_score int := 0;
  v_team2_score int := 0;
  v_team_scores jsonb;
  v_game_id uuid;
  v_first_idx int;
  v_second_idx int;
BEGIN
  -- Validate input
  IF array_length(p_players, 1) != 4
    OR array_length(p_teams, 1) != 4
    OR array_length(p_positions, 1) != 4
    OR array_length(p_tichu_calls, 1) != 4
    OR array_length(p_bomb_count, 1) != 4
    OR array_length(p_double_wins, 1) != 2
    OR array_length(p_scores, 1) != 2
    OR array_length(p_total_scores, 1) != 2 THEN
    RAISE EXCEPTION 'Input arrays must all have the correct length';
END IF;

  -- Detect tichu success
FOR i IN 1..4 LOOP
    v_small_tichu := array_append(v_small_tichu, p_tichu_calls[i] = 'ST');
    v_grand_tichu := array_append(v_grand_tichu, p_tichu_calls[i] = 'GT');
    IF v_small_tichu[i] OR v_grand_tichu[i] THEN
      IF p_positions[i] = 1 THEN
        v_tichu_success := array_append(v_tichu_success, true);
ELSE
        v_tichu_success := array_append(v_tichu_success, false);
END IF;
ELSE
      v_tichu_success := array_append(v_tichu_success, false);
END IF;
END LOOP;

  -- Create a new game
INSERT INTO games (timestamp, beschiss)
VALUES (p_timestamp, p_beschiss)
    RETURNING id INTO v_game_id;

-- Insert game participants
FOR i IN 1..4 LOOP
    INSERT INTO game_participants (game_id, player_id, team, position, tichu_call, grand_tichu_call, tichu_success, bomb_count)
    VALUES (v_game_id, p_players[i], p_teams[i], p_positions[i], v_small_tichu[i], v_grand_tichu[i], v_tichu_success[i], p_bomb_count[i]);
END LOOP;

  -- Insert game scores
FOR i IN 1..2 LOOP
    INSERT INTO game_scores (game_id, team, score, double_win, total_score)
    VALUES (v_game_id, i, p_scores[i], p_double_wins[i], p_total_scores[i]);
END LOOP;

RETURN v_game_id;
END;
$$;

-- Update get_latest_games function to include beschiss flag
DROP FUNCTION IF EXISTS get_latest_games(number_of_games int);
CREATE OR REPLACE FUNCTION get_latest_games(
  number_of_games int
)
RETURNS TABLE (
  id uuid,
  played_at timestamp,
  players text[][],
  team_scores int[],
  bomb_counts int[][],
  beschiss boolean
)
LANGUAGE sql
AS $$
SELECT
    g.id,
    g.timestamp,
    ARRAY[
        ARRAY_AGG(p.name ORDER BY p.name) FILTER (WHERE gp.team = 1),
    ARRAY_AGG(p.name ORDER BY p.name) FILTER (WHERE gp.team = 2)
    ] AS players,
    (
      SELECT ARRAY_AGG(total_score ORDER BY team)
      FROM game_scores
      WHERE game_id = g.id
    ) AS team_scores,
    ARRAY[
      ARRAY_AGG(gp.bomb_count ORDER BY p.name) FILTER (WHERE gp.team = 1),
      ARRAY_AGG(gp.bomb_count ORDER BY p.name) FILTER (WHERE gp.team = 2)
    ] AS bomb_counts,
    g.beschiss
FROM
    games g
    JOIN game_participants gp ON g.id = gp.game_id
    JOIN players p ON p.id = gp.player_id
GROUP BY g.id
ORDER BY g.timestamp DESC
    LIMIT number_of_games;
$$;