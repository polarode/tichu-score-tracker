create or replace function get_latest_rebel_princess_games(
  number_of_games int
)
returns table (
  id uuid,
  played_at timestamp,
  players text[],
  player_points jsonb,
  number_of_players int,
  rounds int
)
language sql
as $$
  WITH player_totals AS (
    SELECT 
      rg.id as game_id,
      p.name as player_name,
      SUM(rrp.points) as total_points
    FROM 
      rp_games rg
    JOIN rp_round_participants rrp ON rg.id = rrp.game_id
    JOIN players p ON p.id = rrp.player_id
    GROUP BY rg.id, p.name
  )
  SELECT 
    rg.id,
    rg.timestamp as played_at,
    ARRAY_AGG(DISTINCT p.name ORDER BY p.name) as players,
    jsonb_object_agg(p.name, COALESCE(pt.total_points, 0)) as player_points,
    rg.number_of_players,
    COUNT(DISTINCT rr.id) as rounds
  FROM 
    rp_games rg
  JOIN rp_rounds rr ON rg.id = rr.game_id
  JOIN rp_round_participants rrp ON rr.id = rrp.round_id
  JOIN players p ON p.id = rrp.player_id
  LEFT JOIN player_totals pt ON rg.id = pt.game_id AND p.name = pt.player_name
  GROUP BY rg.id
  ORDER BY rg.timestamp DESC
  LIMIT number_of_games;
$$;