import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // adjust if you use a different path
import { Card, CardContent, Typography } from "@mui/material";

interface Game {
    id: number;
    played_at: string;
    players: string[][];
    team_scores: number[];
    bomb_counts: number[][];
}

export const LastGames = () => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentGames = async () => {
            const { data, error } = await supabase.rpc("get_latest_games", { number_of_games: 20 });

            if (!error && data) {
                setRecentGames(data as Game[]);
            }
            setLoading(false);
        };

        fetchRecentGames();
    }, []);

    if (loading) return <p>Loading recent games...</p>;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Recent games of Tichu
            </Typography>
            {recentGames.map((game) => (
                <Card key={game.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            {new Date(game.played_at + "Z").toLocaleString()}
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
                    </CardContent>
                </Card>
            ))}
        </>
    );
};
