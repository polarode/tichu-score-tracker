import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Grid, TextField, Button, Stack, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import type { Player } from "../../lib/types";
import { useRebelPrincessGameContext } from "../../context/RebelPrincessGameContext";
import { PageTemplate } from "../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

export default function NewGame() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const { setPlayers, setGameId } = useRebelPrincessGameContext();

    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [knownPlayers, setKnownPlayers] = useState<Player[]>([]);

    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function fetchPlayers() {
        const { data, error } = await supabase.rpc("fetch_players_by_recent_rebel_princess_games");
        if (error) {
            console.error("Error fetching players:", error);
            return;
        }
        setKnownPlayers(
            data.map((p: Player) => {
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

    const handleSubmit = async () => {
        if (playerNames.length < 3) {
            toast.warn("There have to be at least 3 players");
            return;
        }
        if (playerNames.length > 6) {
            toast.warn("There can be no more than 6 players");
            return;
        }

        const selectedPlayers = knownPlayers.filter((player) => playerNames.includes(player.name));
        setPlayers(selectedPlayers);

        try {
            // Create a new game and get the game ID
            const { data, error } = await supabase.rpc("create_rebel_princess_game", {
                p_players: selectedPlayers.map((player) => player.id),
            });

            if (error) throw error;

            // Store the game ID in context
            setGameId(data);
            navigate("/rebel-princess/result");
        } catch (err) {
            console.error("Error creating game:", err);
            toast.error("Failed to create game. Please try again.");
        }
    };

    return (
        <PageTemplate maxWidth="md" showVersionButton={false}>
            <Typography variant="h5" gutterBottom>
                <Trans>Select 3 to 6 Players</Trans>
            </Typography>
            <Grid sx={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                    <InputLabel id="player">
                        <Trans>Players</Trans>
                    </InputLabel>
                    <Select
                        fullWidth={true}
                        multiple
                        value={playerNames}
                        labelId="player"
                        label={<Trans>Players</Trans>}
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
                            label={<Trans>New Player Name</Trans>}
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            size="small"
                        />
                        <Button variant="contained" onClick={handleAddPlayer}>
                            <Trans>Add</Trans>
                        </Button>
                        <Button onClick={() => setIsAddingPlayer(false)}>
                            <Trans>Cancel</Trans>
                        </Button>
                    </Stack>
                ) : (
                    <Button onClick={() => setIsAddingPlayer(true)}>
                        <Trans>+ Add New Player</Trans>
                    </Button>
                )}
            </Grid>
            <Button variant="contained" sx={{ mt: 4 }} onClick={handleSubmit}>
                <Trans>Continue to Result Entry</Trans>
            </Button>
        </PageTemplate>
    );
}
