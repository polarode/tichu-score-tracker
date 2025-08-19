-- Create function to get detailed player statistics including partnerships and recent games
CREATE OR REPLACE FUNCTION get_player_detail_statistics(target_player_id uuid)
RETURNS TABLE (
  player_id uuid,
  player_name text,
  games_played bigint,
  wins bigint,
  losses bigint,
  win_rate numeric,
  avg_score numeric,
  total_points bigint,
  tichu_calls bigint,
  tichu_success bigint,
  grand_tichu_calls bigint,
  grand_tichu_success bigint,
  bombs_used bigint
)
LANGUAGE sql
AS $$
  WITH player_games AS (
    SELECT 
      gp.player_id,
      gp.game_id,
      gp.team,
      gs.total_score,
      CASE 
        WHEN gs.total_score > opponent.total_score THEN 1 
        ELSE 0 
      END as is_win,
      gp.tichu_call,
      gp.tichu_success,
      gp.grand_tichu_call,
      gp.bomb_count
    FROM game_participants gp
    JOIN game_scores gs ON gp.game_id = gs.game_id AND gp.team = gs.team
    JOIN game_scores opponent ON gp.game_id = opponent.game_id AND gp.team != opponent.team
    WHERE gp.player_id = target_player_id
  )
  SELECT 
    p.id as player_id,
    p.name as player_name,
    COUNT(pg.game_id) as games_played,
    SUM(pg.is_win) as wins,
    COUNT(pg.game_id) - SUM(pg.is_win) as losses,
    CASE WHEN COUNT(pg.game_id) > 0 THEN (SUM(pg.is_win)::numeric / COUNT(pg.game_id) * 100) ELSE 0 END as win_rate,
    COALESCE(AVG(pg.total_score), 0) as avg_score,
    COALESCE(SUM(pg.total_score), 0) as total_points,
    COUNT(*) FILTER (WHERE pg.tichu_call = true) as tichu_calls,
    COUNT(*) FILTER (WHERE pg.tichu_call = true AND pg.tichu_success = true) as tichu_success,
    COUNT(*) FILTER (WHERE pg.grand_tichu_call = true) as grand_tichu_calls,
    COUNT(*) FILTER (WHERE pg.grand_tichu_call = true AND pg.tichu_success = true) as grand_tichu_success,
    COALESCE(SUM(pg.bomb_count), 0) as bombs_used
  FROM players p
  LEFT JOIN player_games pg ON p.id = pg.player_id
  WHERE p.id = target_player_id
  GROUP BY p.id, p.name;
$$;

-- Create function to get recent games for a player
CREATE OR REPLACE FUNCTION get_player_recent_games(target_player_id uuid, game_limit integer DEFAULT 10)
RETURNS TABLE (
  game_date timestamp with time zone,
  own_score integer,
  opponent_score integer,
  result text,
  partner_name text,
  opponent_names text
)
LANGUAGE sql
AS $$
  SELECT 
    g.timestamp as game_date,
    gs.total_score as own_score,
    opponent.total_score as opponent_score,
    CASE 
      WHEN gs.total_score > opponent.total_score THEN 'Win'
      WHEN gs.total_score < opponent.total_score THEN 'Loss'
      ELSE 'Draw'
    END as result,
    partner_player.name as partner_name,
    string_agg(opp_player.name, ' & ' ORDER BY opp_player.name) as opponent_names
  FROM games g
  JOIN game_participants gp ON g.id = gp.game_id
  JOIN game_scores gs ON g.id = gs.game_id AND gp.team = gs.team
  JOIN game_scores opponent ON g.id = opponent.game_id AND gp.team != opponent.team
  JOIN game_participants partner ON g.id = partner.game_id AND gp.team = partner.team AND gp.player_id != partner.player_id
  JOIN players partner_player ON partner.player_id = partner_player.id
  JOIN game_participants opp_gp ON g.id = opp_gp.game_id AND gp.team != opp_gp.team
  JOIN players opp_player ON opp_gp.player_id = opp_player.id
  WHERE gp.player_id = target_player_id
  GROUP BY g.id, g.timestamp, gs.total_score, opponent.total_score, partner_player.name
  ORDER BY g.timestamp DESC
  LIMIT game_limit;
$$;

-- Create function to get all partnerships with statistics
CREATE OR REPLACE FUNCTION get_player_partnerships(target_player_id uuid)
RETURNS TABLE (
  partner_id uuid,
  partner_name text,
  games_together bigint,
  wins_together bigint,
  win_rate numeric
)
LANGUAGE sql
AS $$
  SELECT 
    partner.player_id as partner_id,
    partner_player.name as partner_name,
    COUNT(*) as games_together,
    SUM(CASE 
      WHEN gs.total_score > opponent.total_score THEN 1 
      ELSE 0 
    END) as wins_together,
    CASE WHEN COUNT(*) > 0 THEN (SUM(CASE 
      WHEN gs.total_score > opponent.total_score THEN 1 
      ELSE 0 
    END)::numeric / COUNT(*) * 100) ELSE 0 END as win_rate
  FROM game_participants gp
  JOIN game_participants partner ON gp.game_id = partner.game_id AND gp.team = partner.team AND gp.player_id != partner.player_id
  JOIN players partner_player ON partner.player_id = partner_player.id
  JOIN game_scores gs ON gp.game_id = gs.game_id AND gp.team = gs.team
  JOIN game_scores opponent ON gp.game_id = opponent.game_id AND gp.team != opponent.team
  WHERE gp.player_id = target_player_id
  GROUP BY partner.player_id, partner_player.name
  ORDER BY games_together DESC;
$$;