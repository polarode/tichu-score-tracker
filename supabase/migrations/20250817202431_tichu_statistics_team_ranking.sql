CREATE OR REPLACE FUNCTION get_tichu_team_rankings()
RETURNS TABLE (
    player1_id uuid,
    player2_id uuid,
    player1_name text,
    player2_name text,
    games_played bigint,
    wins bigint,
    losses bigint,
    draws bigint,
    win_rate numeric,
    avg_score numeric,
    total_points bigint
) AS $$
BEGIN
    RETURN QUERY
    WITH team_combinations AS (
        SELECT DISTINCT
            LEAST(gp1.player_id, gp2.player_id) as player1_id,
            GREATEST(gp1.player_id, gp2.player_id) as player2_id,
            gp1.game_id
        FROM game_participants gp1
        JOIN game_participants gp2 ON gp1.game_id = gp2.game_id 
            AND gp1.team = gp2.team 
            AND gp1.player_id != gp2.player_id
    ),
    game_results AS (
        SELECT 
            tc.player1_id,
            tc.player2_id,
            tc.game_id,
            gs1.total_score as team_score,
            gs2.total_score as opponent_score,
            CASE 
                WHEN gs1.total_score > gs2.total_score THEN 'win'
                WHEN gs1.total_score < gs2.total_score THEN 'loss'
                ELSE 'draw'
            END as result
        FROM team_combinations tc
        JOIN game_participants gp ON tc.game_id = gp.game_id 
            AND gp.player_id = tc.player1_id
        JOIN game_scores gs1 ON tc.game_id = gs1.game_id AND gp.team = gs1.team
        JOIN game_scores gs2 ON tc.game_id = gs2.game_id AND gs1.team != gs2.team
    ),
    team_stats AS (
        SELECT 
            gr.player1_id,
            gr.player2_id,
            COUNT(*) as games_played,
            SUM(CASE WHEN gr.result = 'win' THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN gr.result = 'loss' THEN 1 ELSE 0 END) as losses,
            SUM(CASE WHEN gr.result = 'draw' THEN 1 ELSE 0 END) as draws,
            AVG(gr.team_score) as avg_score,
            SUM(gr.team_score) as total_points
        FROM game_results gr
        GROUP BY gr.player1_id, gr.player2_id
        HAVING COUNT(*) >= 5  -- Only teams with at least 5 games
    )
    SELECT 
        ts.player1_id,
        ts.player2_id,
        p1.name::text as player1_name,
        p2.name::text as player2_name,
        ts.games_played,
        ts.wins,
        ts.losses,
        ts.draws,
        ROUND((ts.wins::numeric / ts.games_played * 100), 1) as win_rate,
        ROUND(ts.avg_score, 0) as avg_score,
        ts.total_points
    FROM team_stats ts
    JOIN players p1 ON ts.player1_id = p1.id
    JOIN players p2 ON ts.player2_id = p2.id
    ORDER BY ts.wins DESC, win_rate DESC;
END;
$$ LANGUAGE plpgsql;