import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent, Typography } from "@mui/material";

interface RPGame {
    id: string;
    played_at: string;
    players: string[];
    player_points: Record<string, number>;
    number_of_players: number;
    rounds: number;
}

export const LastRebelPrincessGames = () => {
    const [recentGames, setRecentGames] = useState<RPGame[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentGames = async () => {
            const { data, error } = await supabase.rpc("get_latest_rebel_princess_games", { number_of_games: 20 });

            if (!error && data) {
                setRecentGames(data as RPGame[]);
            }
            setLoading(false);
        };

        fetchRecentGames();
    }, []);

    if (loading) return <p>Loading recent games...</p>;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Recent games of Rebel Princess
            </Typography>
            {recentGames.map((game) => (
                <Card key={game.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            {new Date(game.played_at + "Z").toLocaleString()}
                        </Typography>
                        <Typography>Rounds played: {game.rounds}</Typography>
                        {game.players.map((player) => (
                            <Typography key={player}>
                                {player}: {game.player_points[player] || 0} points
                            </Typography>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </>
    );
};
