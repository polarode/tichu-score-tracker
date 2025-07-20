-- Create a function to fetch players ordered by their most recent Tichu game participation
CREATE OR REPLACE FUNCTION fetch_players_by_recent_tichu_games()
RETURNS SETOF players
LANGUAGE sql
STABLE
AS $$
  SELECT p.*
  FROM players p
  LEFT JOIN LATERAL (
    SELECT gp.player_id, MAX(g.timestamp) as last_game
    FROM game_participants gp
    JOIN games g ON gp.game_id = g.id
    WHERE gp.player_id = p.id
    GROUP BY gp.player_id
  ) recent ON true
  ORDER BY recent.last_game DESC NULLS LAST, p.name ASC;
$$;

-- Create a function to fetch players ordered by their most recent Rebel Princess game participation
CREATE OR REPLACE FUNCTION fetch_players_by_recent_rebel_princess_games()
RETURNS SETOF players
LANGUAGE sql
STABLE
AS $$
  SELECT p.*
  FROM players p
  LEFT JOIN LATERAL (
    SELECT rp.player_id, MAX(g.timestamp) as last_game
    FROM rp_round_participants rp
    JOIN rp_games g ON rp.game_id = g.id
    WHERE rp.player_id = p.id
    GROUP BY rp.player_id
  ) recent ON true
  ORDER BY recent.last_game DESC NULLS LAST, p.name ASC;
$$;