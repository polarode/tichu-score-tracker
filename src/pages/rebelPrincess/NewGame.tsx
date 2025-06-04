import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Stack,
    MenuItem,
    Select,
    Box,
    FormControl,
    InputLabel,
} from "@mui/material";
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import type { Player } from "../../lib/types";
import { useRebelPrincessGameContext } from "../../context/RebelPrincessGameContext";

export default function NewGame() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const { setPlayers } = useRebelPrincessGameContext();

    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [knownPlayers, setKnownPlayers] = useState<Player[]>([]);

    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

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
        if (playerNames.length < 3) {
            toast.warn("There have to be at least 3 players");
            return;
        }
        if (playerNames.length > 6) {
            toast.warn("There can be no more than 6 players");
            return;
        }
        setPlayers(knownPlayers.filter((player) => playerNames.includes(player.name)));
        //toast.info("work in progress. coming soon")
        navigate("/rebel-princess/result");
    };

    return (
        <Box maxWidth={800} mx="auto" p={2}>
            <Container sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Select 3 to 6 Players
                </Typography>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="player">Players</InputLabel>
                        <Select
                            fullWidth={true}
                            multiple
                            value={playerNames}
                            labelId="player"
                            label="Players"
                            onChange={(event) => {
                                const value = event.target.value as string[];
                                if (value.length <= 6) {
                                    setPlayerNames(value);
                                }
                            }}
                        >
                            {knownPlayers.map((p) => (
                                <MenuItem value={p.name}>{p.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                </Grid>
                <Button variant="contained" sx={{ mt: 4 }} onClick={handleSubmit}>
                    Continue to Result Entry
                </Button>
            </Container>
        </Box>
    );
}
