create or replace function insert_rebel_princess_round(
  p_game_id uuid,
  p_players uuid[],
  p_points int[],
  p_round_modifier varchar,
  p_timestamp timestamptz default now()
)
returns uuid
language plpgsql
as $$
declare
  v_round_id uuid;
  v_total_points int := 0;
begin
  -- Validate input
  if array_length(p_players, 1) < 3 or array_length(p_players, 1) > 6 then
    raise exception 'Number of players must be between 3 and 6';
  end if;
  
  if array_length(p_players, 1) != array_length(p_points, 1) then
    raise exception 'Player and points arrays must have the same length';
  end if;
  
  -- Calculate total points
  for i in 1..array_length(p_points, 1) loop
    v_total_points := v_total_points + p_points[i];
  end loop;
  
  -- Create a new round
  insert into rp_rounds (game_id, round_modifier, points)
  values (p_game_id, p_round_modifier, v_total_points)
  returning id into v_round_id;
  
  -- Insert round participants
  for i in 1..array_length(p_players, 1) loop
    insert into rp_round_participants (game_id, round_id, player_id, points)
    values (p_game_id, v_round_id, p_players[i], p_points[i]);
  end loop;
  
  return v_round_id;
end;
$$;