import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import { useTichuGameContext } from "../../context/TichuGameContext";
import { supabase } from "../../lib/supabase";
import { type Player } from "../../lib/types";
import { toast } from "react-toastify";
import ReplayIcon from "@mui/icons-material/Replay";

export default function NewGame() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const { setTeams, currentMatch, setCurrentMatch, setMatchStandings } = useTichuGameContext();

    const [team1, setTeam1] = useState<string[]>([]);
    const [team2, setTeam2] = useState<string[]>([]);
    const [knownPlayers, setKnownPlayers] = useState<Player[]>([]);

    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);

    useEffect(() => {
        fetchPlayers();
        checkActiveMatch();
    }, []);

    const checkActiveMatch = async () => {
        try {
            const { data: matches, error } = await supabase
                .from("match_series")
                .select(`
                    *,
                    match_participants(
                        player_id,
                        team,
                        players(id, name)
                    )
                `)
                .eq("status", "active")
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) throw error;

            if (matches && matches.length > 0) {
                const match = matches[0];
                setCurrentMatch(match);

                const team1Players = match.match_participants
                    .filter((p: any) => p.team === 1)
                    .map((p: any) => p.players);
                const team2Players = match.match_participants
                    .filter((p: any) => p.team === 2)
                    .map((p: any) => p.players);

                setTeam1(team1Players.map((p: any) => p.name));
                setTeam2(team2Players.map((p: any) => p.name));
                setTeams(team1Players, team2Players);

                toast.info(`Continuing active match to ${match.target_points} points`);
            }
        } catch (err) {
            console.error("Error checking active match:", err);
        }
    };

    async function fetchPlayers() {
        const { data, error } = await supabase.from("players").select("id, name").order("name", { ascending: true });
        if (error) {
            console.error("Error fetching players:", error);
            return;
        }
        setKnownPlayers(
            data.map((p) => {
                return { id: p.id, name: p.name };
            }),
        );
    }

    const handleAddPlayer = async () => {
        if (!newPlayerName.trim()) return;

        const { error } = await supabase.from("players").insert([{ name: newPlayerName.trim() }]);

        if (!error) {
            setNewPlayerName("");
            fetchPlayers(); // Refresh available players
            setIsAddingPlayer(false);
        } else {
            console.error("Error adding player:", error);
        }
    };

    const handleSubmit = () => {
        if (team1.length !== 2 || team2.length !== 2) {
            toast.warn("Each team must have exactly 2 players");
            return;
        }

        const overlap = team1.filter((p) => team2.includes(p));
        if (overlap.length > 0) {
            toast.warn(`Players cannot be on both teams: ${overlap.join(", ")}`);
            return;
        }

        setTeams(
            knownPlayers.filter((player) => team1.includes(player.name)),
            knownPlayers.filter((player) => team2.includes(player.name)),
        );
        navigate("/tichu/result");
    };

    const handleRematch = async () => {
        try {
            const { data, error } = await supabase.rpc("get_latest_games", { number_of_games: 1 });

            if (error) throw error;

            if (data && data.length > 0) {
                const lastGame = data[0];

                // Check if game was played within the last 2 hours
                const gameTime = new Date(lastGame.played_at + "Z");
                const twoHoursAgo = new Date();
                twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

                if (gameTime > twoHoursAgo) {
                    // Set teams from the last game
                    setTeam1(lastGame.players[0]);
                    setTeam2(lastGame.players[1]);
                    toast.info("Teams set to previous game");
                } else {
                    toast.info("There is no recent game to do a rematch for.");
                }
            } else {
                toast.warn("No previous games found");
            }
        } catch (err) {
            console.error("Error fetching last game:", err);
            toast.error("Failed to fetch previous game");
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
                {isAddingPlayer ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="New Player Name"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            size="small"
                        />
                        <Button variant="contained" onClick={handleAddPlayer}>
                            Add
                        </Button>
                        <Button onClick={() => setIsAddingPlayer(false)}>Cancel</Button>
                    </Stack>
                ) : (
                    <Button onClick={() => setIsAddingPlayer(true)}>+ Add New Player</Button>
                )}
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button startIcon={<ReplayIcon />} variant="outlined" onClick={handleRematch}>
                        Rematch
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Continue to Result Entry
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
