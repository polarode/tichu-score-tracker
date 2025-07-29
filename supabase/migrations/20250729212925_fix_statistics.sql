-- Fix Rebel Princess player statistics function
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
  ),
  player_stats AS (
    SELECT 
      p.id as player_id,
      p.name as player_name,
      COUNT(DISTINCT rrp.game_id) as games_played,
      COUNT(rrp.id) as rounds_played,
      COALESCE(ROUND(AVG(rrp.points), 2), 0) as avg_points_per_round
    FROM players p
    LEFT JOIN rp_round_participants rrp ON p.id = rrp.player_id
    GROUP BY p.id, p.name
  ),
  player_wins AS (
    SELECT 
      player_id,
      COUNT(*) as games_won
    FROM game_winners
    WHERE rank = 1
    GROUP BY player_id
  )
  SELECT 
    ps.player_id,
    ps.player_name,
    ps.games_played,
    ps.rounds_played,
    ps.avg_points_per_round,
    COALESCE(pw.games_won, 0) as games_won,
    CASE 
      WHEN ps.games_played > 0 
      THEN ROUND((COALESCE(pw.games_won, 0)::numeric / ps.games_played) * 100, 2)
      ELSE 0 
    END as win_rate
  FROM player_stats ps
  LEFT JOIN player_wins pw ON ps.player_id = pw.player_id
  ORDER BY ps.games_played DESC, ps.player_name;
$$;