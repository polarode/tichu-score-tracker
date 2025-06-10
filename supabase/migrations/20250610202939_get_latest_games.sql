create or replace function get_latest_games(
  number_of_games int
)
returns table (
  id uuid,
  played_at timestamp,
  players text[][],
  team_scores int[],
  bomb_counts int[][]
)
language sql
as $$
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
    ] AS bomb_counts
  FROM 
    games g
  JOIN game_participants gp ON g.id = gp.game_id
  JOIN players p ON p.id = gp.player_id
  GROUP BY g.id
  ORDER BY g.timestamp DESC
  LIMIT number_of_games;
$$;

