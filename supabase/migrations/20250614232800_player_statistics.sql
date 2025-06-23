-- Create a function to get player statistics
CREATE OR REPLACE FUNCTION get_player_statistics()
RETURNS TABLE (
  player_id uuid,
  player_name text,
  games_played bigint,
  avg_score numeric,
  tichu_calls bigint,
  tichu_success bigint,
  grand_tichu_calls bigint,
  grand_tichu_success bigint,
  bombs_used bigint
)
LANGUAGE sql
AS $$
  SELECT 
    p.id as player_id,
    p.name as player_name,
    COUNT(DISTINCT gp.game_id) as games_played,
    COALESCE(AVG(gs.total_score), 0) as avg_score,
    COUNT(gp.id) FILTER (WHERE gp.tichu_call = true) as tichu_calls,
    COUNT(gp.id) FILTER (WHERE gp.tichu_call = true AND gp.tichu_success = true) as tichu_success,
    COUNT(gp.id) FILTER (WHERE gp.grand_tichu_call = true) as grand_tichu_calls,
    COUNT(gp.id) FILTER (WHERE gp.grand_tichu_call = true AND gp.tichu_success = true) as grand_tichu_success,
    COALESCE(SUM(gp.bomb_count), 0) as bombs_used
  FROM 
    players p
  LEFT JOIN game_participants gp ON p.id = gp.player_id
  LEFT JOIN game_scores gs ON gp.game_id = gs.game_id AND gp.team = gs.team
  GROUP BY p.id, p.name
  ORDER BY games_played DESC, player_name;
$$;