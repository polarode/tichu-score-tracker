CREATE OR REPLACE FUNCTION get_tichu_game_overview_stats()
RETURNS TABLE (
    total_games bigint,
    total_players bigint,
    average_game_score numeric,
    total_tichu_calls bigint,
    successful_tichus bigint,
    total_grand_tichu_calls bigint,
    successful_grand_tichus bigint,
    total_bombs bigint,
    average_bombs_per_game numeric,
    average_tichu_calls_per_game numeric,
    average_grand_tichu_calls_per_game numeric,
    max_bombs_in_one_game bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM games) as total_games,
        (SELECT COUNT(DISTINCT player_id) FROM game_participants) as total_players,
        (SELECT ROUND(AVG(score)) FROM game_scores) as average_game_score,
        SUM(CASE WHEN gp.tichu_call AND NOT gp.grand_tichu_call THEN 1 ELSE 0 END) as total_tichu_calls,
        SUM(CASE WHEN gp.tichu_call AND NOT gp.grand_tichu_call AND gp.tichu_success THEN 1 ELSE 0 END) as successful_tichus,
        SUM(CASE WHEN gp.grand_tichu_call THEN 1 ELSE 0 END) as total_grand_tichu_calls,
        SUM(CASE WHEN gp.grand_tichu_call AND gp.tichu_success THEN 1 ELSE 0 END) as successful_grand_tichus,
        SUM(COALESCE(gp.bomb_count, 0)) as total_bombs,
        ROUND(SUM(COALESCE(gp.bomb_count, 0))::numeric / (SELECT COUNT(*) FROM games), 1) as average_bombs_per_game,
        ROUND(SUM(CASE WHEN gp.tichu_call AND NOT gp.grand_tichu_call THEN 1 ELSE 0 END)::numeric / (SELECT COUNT(*) FROM games), 1) as average_tichu_calls_per_game,
        ROUND(SUM(CASE WHEN gp.grand_tichu_call THEN 1 ELSE 0 END)::numeric / (SELECT COUNT(*) FROM games), 1) as average_grand_tichu_calls_per_game,
        (
            SELECT MAX(game_bombs) FROM (
                SELECT SUM(COALESCE(bomb_count, 0)) as game_bombs
                FROM game_participants
                GROUP BY game_id
            ) bomb_totals
        ) as max_bombs_in_one_game
    FROM game_participants gp;
END;
$$ LANGUAGE plpgsql;