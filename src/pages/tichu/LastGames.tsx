import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // adjust if you use a different path
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Trans } from "@lingui/react/macro";

interface Game {
    id: number;
    played_at: string;
    players: string[][];
    team_scores: number[];
    bomb_counts: number[][];
    beschiss: boolean;
}

export const LastGames = () => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentGames = async () => {
            // Get games that are NOT part of a match (standalone games only)
            const { data, error } = await supabase
                .from("games")
                .select(`
                    id,
                    timestamp,
                    beschiss,
                    game_participants(
                        team,
                        position,
                        bomb_count,
                        players(name)
                    ),
                    game_scores(
                        team,
                        total_score
                    )
                `)
                .is("match_id", null)
                .order("timestamp", { ascending: false })
                .limit(10);

            if (!error && data) {
                const formattedGames = data.map((game: any) => {
                    const team1Players = game.game_participants
                        .filter((p: any) => p.team === 1)
                        .sort((a: any, b: any) => a.position - b.position)
                        .map((p: any) => p.players.name);
                    const team2Players = game.game_participants
                        .filter((p: any) => p.team === 2)
                        .sort((a: any, b: any) => a.position - b.position)
                        .map((p: any) => p.players.name);

                    const team1Bombs = game.game_participants
                        .filter((p: any) => p.team === 1)
                        .sort((a: any, b: any) => a.position - b.position)
                        .map((p: any) => p.bomb_count || 0);
                    const team2Bombs = game.game_participants
                        .filter((p: any) => p.team === 2)
                        .sort((a: any, b: any) => a.position - b.position)
                        .map((p: any) => p.bomb_count || 0);

                    const team1Score = game.game_scores.find((s: any) => s.team === 1)?.total_score || 0;
                    const team2Score = game.game_scores.find((s: any) => s.team === 2)?.total_score || 0;

                    return {
                        id: game.id,
                        played_at: game.timestamp,
                        players: [team1Players, team2Players],
                        team_scores: [team1Score, team2Score],
                        bomb_counts: [team1Bombs, team2Bombs],
                        beschiss: game.beschiss || false,
                    };
                });
                setRecentGames(formattedGames);
            }
            setLoading(false);
        };

        fetchRecentGames();
    }, []);

    if (loading) return <p>Loading recent games...</p>;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                <Trans>Recent games of Tichu</Trans>
            </Typography>
            {recentGames.map((game) => (
                <Card key={game.id} variant="outlined" sx={{ mb: 2, position: "relative" }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            {new Date(game.played_at).toLocaleString()}
                        </Typography>
                        <Typography>
                            {game.players[0][0]}
                            {"💣".repeat(game.bomb_counts[0][0])},{game.players[0][1]}
                            {"💣".repeat(game.bomb_counts[0][1])}: {game.team_scores[0]}
                        </Typography>
                        <Typography>
                            {game.players[1][0]}
                            {"💣".repeat(game.bomb_counts[1][0])},{game.players[1][1]}
                            {"💣".repeat(game.bomb_counts[1][1])}: {game.team_scores[1]}
                        </Typography>
                        {game.beschiss && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    color: "error.main",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Beschiss
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}
        </>
    );
};
