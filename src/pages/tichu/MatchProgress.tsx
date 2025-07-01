import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import { useTichuGameContext } from "../../context/TichuGameContext";
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import { PageTemplate } from "../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

export default function MatchProgress() {
    const navigate = useNavigate();
    const { currentMatch, matchStandings, team1, team2, setCurrentMatch, setMatchStandings } = useTichuGameContext();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentMatch) {
            navigate("/");
            return;
        }
        loadMatchStandings();
    }, [currentMatch, navigate]);

    const loadMatchStandings = async () => {
        if (!currentMatch) return;

        try {
            const { data: standings, error } = await supabase.rpc("get_match_standings", {
                p_match_id: currentMatch.id,
            });

            if (error) throw error;
            setMatchStandings(standings);
        } catch (err) {
            console.error("Error loading match standings:", err);
        }
    };

    const handleContinueMatch = () => {
        navigate("/tichu/result");
    };

    const handleEndMatch = async () => {
        if (!currentMatch) return;

        setLoading(true);
        try {
            await supabase.from("match_series").update({ status: "completed" }).eq("id", currentMatch.id);

            setCurrentMatch(null);
            setMatchStandings(null);
            toast.success("Match ended");
            navigate("/");
        } catch (err) {
            console.error("Error ending match:", err);
            toast.error("Failed to end match");
        } finally {
            setLoading(false);
        }
    };

    if (!currentMatch || !matchStandings) {
        return <Typography>Loading...</Typography>;
    }

    const team1Score = matchStandings.find((s) => s.team === 1)?.total_score || 0;
    const team2Score = matchStandings.find((s) => s.team === 2)?.total_score || 0;
    const maxScore = Math.max(team1Score, team2Score);
    const progress = (maxScore / currentMatch.target_points) * 100;

    return (
        <PageTemplate maxWidth="md" showVersionButton={false}>
            <Typography variant="h5" gutterBottom>
                <Trans>Match Progress</Trans>
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <Trans>Target: {currentMatch.target_points} points</Trans>
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                        sx={{ height: 10, borderRadius: 5, mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        <Trans>{Math.round(progress)}% to target</Trans>
                    </Typography>
                </CardContent>
            </Card>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Trans>Team</Trans>
                        </TableCell>
                        <TableCell>
                            <Trans>Players</Trans>
                        </TableCell>
                        <TableCell align="right">
                            <Trans>Score</Trans>
                        </TableCell>
                        <TableCell align="right">
                            <Trans>Games</Trans>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Trans>Team 1</Trans>
                        </TableCell>
                        <TableCell>{team1.map((p) => p.name).join(", ")}</TableCell>
                        <TableCell align="right">{team1Score}</TableCell>
                        <TableCell align="right">{matchStandings.find((s) => s.team === 1)?.game_count || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Trans>Team 2</Trans>
                        </TableCell>
                        <TableCell>{team2.map((p) => p.name).join(", ")}</TableCell>
                        <TableCell align="right">{team2Score}</TableCell>
                        <TableCell align="right">{matchStandings.find((s) => s.team === 2)?.game_count || 0}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button variant="contained" onClick={handleContinueMatch} disabled={loading}>
                    <Trans>Continue Match</Trans>
                </Button>
                <Button variant="outlined" color="error" onClick={handleEndMatch} disabled={loading}>
                    <Trans>End Match</Trans>
                </Button>
            </Box>
        </PageTemplate>
    );
}
