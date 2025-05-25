import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Grid, Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useGameContext, type Player } from "../context/GameContext";
import { supabase } from "../lib/supabase";
import { LastGames } from "./LastGames";

export default function NewGame() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const { setTeams } = useGameContext();

    const [team1, setTeam1] = useState<string[]>([]);
    const [team2, setTeam2] = useState<string[]>([]);
    const [knownPlayers, setKnownPlayers] = useState<Player[]>([]);

    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function fetchPlayers() {
        const { data, error } = await supabase.from("players").select("id, name");
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
            alert("Each team must have exactly 2 players");
            return;
        }

        const overlap = team1.filter((p) => team2.includes(p));
        if (overlap.length > 0) {
            alert(`Players cannot be on both teams: ${overlap.join(", ")}`);
            return;
        }

        setTeams(
            knownPlayers.filter((player) => team1.includes(player.name)),
            knownPlayers.filter((player) => team2.includes(player.name)),
        );
        navigate("/result");
    };

    const availableForTeam = (team: number) => {
        const selected = team === 1 ? team2 : team1;
        return knownPlayers.filter((player) => !selected.includes(player.name)).map((player) => player.name);
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                Select Teams
            </Typography>
            <Grid container spacing={4}>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Typography>Team 1</Typography>
                    <Autocomplete
                        multiple
                        options={availableForTeam(1)}
                        value={team1}
                        onChange={(_, value) => value.length <= 2 && setTeam1(value)}
                        disableCloseOnSelect
                        renderInput={(params) => <TextField {...params} label="Team 1 Players" />}
                    />
                </Grid>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Typography>Team 2</Typography>
                    <Autocomplete
                        multiple
                        options={availableForTeam(2)}
                        value={team2}
                        onChange={(_, value) => value.length <= 2 && setTeam2(value)}
                        disableCloseOnSelect
                        renderInput={(params) => <TextField {...params} label="Team 2 Players" />}
                    />
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
            </Grid>
            <Button variant="contained" sx={{ mt: 4 }} onClick={handleSubmit}>
                Continue to Result Entry
            </Button>
            <LastGames />
        </Container>
    );
}
