import { useEffect, useState } from "react";
import { Typography, Box, Chip } from "@mui/material";
import { supabase } from "../../lib/supabase";

type MatchResult = {
    id: string;
    created_at: string;
    target_points: number;
    status: string;
    winning_team: number | null;
    team1_players: string[];
    team2_players: string[];
    team1_score: number;
    team2_score: number;
    game_count: number;
};

export function LastMatches() {
    const [matches, setMatches] = useState<MatchResult[]>([]);

    useEffect(() => {
        fetchLastMatches();
    }, []);

    const fetchLastMatches = async () => {
        try {
            const { data, error } = await supabase
                .from("match_series")
                .select(`
                    id,
                    created_at,
                    target_points,
                    status,
                    winning_team,
                    match_participants(
                        team,
                        players(name)
                    )
                `)
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) throw error;

            const matchResults: MatchResult[] = [];

            for (const match of data || []) {
                const team1_players = match.match_participants
                    .filter((p: any) => p.team === 1)
                    .map((p: any) => p.players.name);
                const team2_players = match.match_participants
                    .filter((p: any) => p.team === 2)
                    .map((p: any) => p.players.name);

                let team1_score = 0;
                let team2_score = 0;
                let gameCount = 0;

                if (match.status === "completed") {
                    const { data: standings } = await supabase.rpc("get_match_standings", {
                        p_match_id: match.id,
                    });

                    if (standings) {
                        team1_score = standings.find((s: any) => s.team === 1)?.total_score || 0;
                        team2_score = standings.find((s: any) => s.team === 2)?.total_score || 0;
                        gameCount = standings.reduce((sum: number, s: any) => sum + s.game_count, 0) / 2;
                    }
                }

                matchResults.push({
                    id: match.id,
                    created_at: match.created_at,
                    target_points: match.target_points,
                    status: match.status,
                    winning_team: match.winning_team,
                    team1_players,
                    team2_players,
                    team1_score,
                    team2_score,
                    game_count: gameCount,
                });
            }

            setMatches(matchResults);
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    };

    if (matches.length === 0) {
        return (
            <>
                <Typography variant="h6" gutterBottom>
                    Recent matches of Tichu
                </Typography>
                <Typography color="text.secondary">No matches played yet</Typography>
            </>
        );
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Recent matches of Tichu
            </Typography>
            {matches.map((match) => (
                <Box key={match.id} sx={{ mb: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {new Date(match.created_at).toLocaleString()}
                        </Typography>
                        <Chip
                            label={match.status === "active" ? "Active" : "Completed"}
                            color={match.status === "active" ? "primary" : "success"}
                            size="small"
                        />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Target: {match.target_points} points
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Typography variant="body2">
                                <strong>Team 1:</strong> {match.team1_players.join(", ")}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Team 2:</strong> {match.team2_players.join(", ")}
                            </Typography>
                        </Box>

                        {match.status === "completed" && (
                            <Box sx={{ textAlign: "right" }}>
                                <Typography variant="body2">
                                    {match.team1_score} - {match.team2_score}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {match.game_count} games
                                </Typography>
                                {match.winning_team && (
                                    <Typography variant="body2" color="success.main">
                                        Team {match.winning_team} wins!
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
        </>
    );
}
