import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import { useTichuGameContext } from "../../context/TichuGameContext";
import { supabase } from "../../lib/supabase";
import { type Player } from "../../lib/types";
import { toast } from "react-toastify";

export default function NewMatch() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const { setTeams, setCurrentMatch } = useTichuGameContext();

    const [team1, setTeam1] = useState<string[]>([]);
    const [team2, setTeam2] = useState<string[]>([]);
    const [knownPlayers, setKnownPlayers] = useState<Player[]>([]);
    const [targetPoints, setTargetPoints] = useState<number>(500);
    const [customTarget, setCustomTarget] = useState<string>("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function fetchPlayers() {
        const { data, error } = await supabase.from("players").select("id, name").order("name", { ascending: true });
        if (error) {
            console.error("Error fetching players:", error);
            return;
        }
        setKnownPlayers(data.map((p) => ({ id: p.id, name: p.name })));
    }

    const handleTargetChange = (value: number | string) => {
        if (typeof value === "number") {
            setTargetPoints(value);
            setCustomTarget("");
        } else {
            setTargetPoints(0);
            setCustomTarget(value);
        }
    };

    const handleSubmit = async () => {
        if (team1.length !== 2 || team2.length !== 2) {
            toast.warn("Each team must have exactly 2 players");
            return;
        }

        const overlap = team1.filter((p) => team2.includes(p));
        if (overlap.length > 0) {
            toast.warn(`Players cannot be on both teams: ${overlap.join(", ")}`);
            return;
        }

        const finalTarget = targetPoints || parseInt(customTarget);
        if (!finalTarget || finalTarget < 100) {
            toast.warn("Target points must be at least 100");
            return;
        }

        const team1Players = knownPlayers.filter((player) => team1.includes(player.name));
        const team2Players = knownPlayers.filter((player) => team2.includes(player.name));

        try {
            const { data: matchId, error } = await supabase.rpc("create_match_series", {
                p_target_points: finalTarget,
                p_team1_players: team1Players.map((p) => p.id),
                p_team2_players: team2Players.map((p) => p.id),
            });

            if (error) throw error;

            // Fetch the created match
            const { data: match, error: matchError } = await supabase
                .from("match_series")
                .select("*")
                .eq("id", matchId)
                .single();

            if (matchError) throw matchError;

            setCurrentMatch(match);
            setTeams(team1Players, team2Players);
            toast.success(`Match to ${finalTarget} points created!`);
            navigate("/tichu/result");
        } catch (err) {
            console.error("Error creating match:", err);
            toast.error("Failed to create match");
        }
    };

    const availableForTeam = (team: number) => {
        const selected = team === 1 ? team2 : team1;
        return knownPlayers.filter((player) => !selected.includes(player.name)).map((player) => player.name);
    };

    return (
        <Box maxWidth={800} mx="auto" p={2}>
            <Container sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Start New Match
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Target Points
                    </Typography>
                    <ToggleButtonGroup
                        exclusive
                        value={targetPoints || "custom"}
                        onChange={(_, value) => handleTargetChange(value)}
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value={500}>500</ToggleButton>
                        <ToggleButton value={1000}>1000</ToggleButton>
                        <ToggleButton value="custom">Custom</ToggleButton>
                    </ToggleButtonGroup>
                    {(!targetPoints || targetPoints === 0) && (
                        <TextField
                            label="Custom Target"
                            type="number"
                            value={customTarget}
                            onChange={(e) => setCustomTarget(e.target.value)}
                            size="small"
                            sx={{ ml: 2 }}
                        />
                    )}
                </Box>

                <Typography variant="h6" gutterBottom>
                    Select Teams
                </Typography>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <FormControl sx={{ minWidth: "48%" }}>
                            <InputLabel id="team1">Team 1</InputLabel>
                            <Select
                                fullWidth
                                multiple
                                value={team1}
                                labelId="team1"
                                label="Team 1"
                                onChange={(event) => {
                                    const value = event.target.value as string[];
                                    if (value.length <= 2) {
                                        setTeam1(value);
                                    }
                                }}
                            >
                                {availableForTeam(1).map((p) => (
                                    <MenuItem key={p} value={p}>
                                        {p}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: "48%" }}>
                            <InputLabel id="team2">Team 2</InputLabel>
                            <Select
                                fullWidth
                                multiple
                                value={team2}
                                labelId="team2"
                                label="Team 2"
                                onChange={(event) => {
                                    const value = event.target.value as string[];
                                    if (value.length <= 2) {
                                        setTeam2(value);
                                    }
                                }}
                            >
                                {availableForTeam(2).map((p) => (
                                    <MenuItem key={p} value={p}>
                                        {p}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Start Match
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
