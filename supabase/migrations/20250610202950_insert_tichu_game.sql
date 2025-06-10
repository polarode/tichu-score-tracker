create or replace function insert_tichu_game(
  p_players uuid[],
  p_teams int[],
  p_positions int[],
  p_tichu_calls text[],
  p_bomb_count int[],
  p_double_wins boolean[],
  p_scores int[],
  p_total_scores int[],
  p_timestamp timestamptz default now()
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
  insert into games (timestamp)
  values (p_timestamp)
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