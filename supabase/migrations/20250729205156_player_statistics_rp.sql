-- Create a function to get Rebel Princess player statistics
CREATE OR REPLACE FUNCTION get_rp_player_statistics()
RETURNS TABLE (
  player_id uuid,
  player_name text,
  games_played bigint,
  rounds_played bigint,
  avg_points_per_round numeric,
  games_won bigint,
  win_rate numeric
)
LANGUAGE sql
AS $$
  WITH game_winners AS (
    SELECT 
      rg.id as game_id,
      rrp.player_id,
      ROW_NUMBER() OVER (PARTITION BY rg.id ORDER BY SUM(rrp.points) ASC) as rank
    FROM rp_games rg
    JOIN rp_round_participants rrp ON rg.id = rrp.game_id
    GROUP BY rg.id, rrp.player_id
  )
  SELECT 
    p.id as player_id,
    p.name as player_name,
    COUNT(DISTINCT rrp.game_id) as games_played,
    COUNT(rrp.id) as rounds_played,
    COALESCE(ROUND(AVG(rrp.points), 2), 0) as avg_points_per_round,
    COUNT(DISTINCT gw.game_id) FILTER (WHERE gw.rank = 1) as games_won,
    CASE 
      WHEN COUNT(DISTINCT rrp.game_id) > 0 
      THEN ROUND((COUNT(DISTINCT gw.game_id) FILTER (WHERE gw.rank = 1)::numeric / COUNT(DISTINCT rrp.game_id)) * 100, 2)
      ELSE 0 
    END as win_rate
  FROM 
    players p
  LEFT JOIN rp_round_participants rrp ON p.id = rrp.player_id
  LEFT JOIN game_winners gw ON p.id = gw.player_id
  GROUP BY p.id, p.name
  ORDER BY games_played DESC, player_name;
$$;