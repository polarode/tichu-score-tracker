create or replace function create_rebel_princess_game(
  p_players uuid[],
  p_timestamp timestamptz default now()
)
returns uuid
language plpgsql
as $$
declare
  v_game_id uuid;
begin
  -- Validate input
  if array_length(p_players, 1) < 3 or array_length(p_players, 1) > 6 then
    raise exception 'Number of players must be between 3 and 6';
  end if;
  
  -- Create a new game
  insert into rp_games (timestamp, number_of_players)
  values (p_timestamp, array_length(p_players, 1))
  returning id into v_game_id;
  
  return v_game_id;
end;
$$;