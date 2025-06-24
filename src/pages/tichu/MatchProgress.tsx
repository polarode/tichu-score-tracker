import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
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
                p_match_id: currentMatch.id
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
            await supabase
                .from("match_series")
                .update({ status: "completed" })
                .eq("id", currentMatch.id);
            
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

    const team1Score = matchStandings.find(s => s.team === 1)?.total_score || 0;
    const team2Score = matchStandings.find(s => s.team === 2)?.total_score || 0;
    const maxScore = Math.max(team1Score, team2Score);
    const progress = (maxScore / currentMatch.target_points) * 100;

    return (
        <Box maxWidth={600} mx="auto" p={2}>
            <Container sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Match Progress
                </Typography>
                
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Target: {currentMatch.target_points} points
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={Math.min(progress, 100)} 
                            sx={{ height: 10, borderRadius: 5, mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(progress)}% to target
                        </Typography>
                    </CardContent>
                </Card>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team</TableCell>
                            <TableCell>Players</TableCell>
                            <TableCell align="right">Score</TableCell>
                            <TableCell align="right">Games</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Team 1</TableCell>
                            <TableCell>{team1.map(p => p.name).join(", ")}</TableCell>
                            <TableCell align="right">{team1Score}</TableCell>
                            <TableCell align="right">{matchStandings.find(s => s.team === 1)?.game_count || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Team 2</TableCell>
                            <TableCell>{team2.map(p => p.name).join(", ")}</TableCell>
                            <TableCell align="right">{team2Score}</TableCell>
                            <TableCell align="right">{matchStandings.find(s => s.team === 2)?.game_count || 0}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleContinueMatch}
                        disabled={loading}
                    >
                        Continue Match
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleEndMatch}
                        disabled={loading}
                    >
                        End Match
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}