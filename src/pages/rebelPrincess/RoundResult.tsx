import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Typography, Box, TextField, Grid, Autocomplete } from "@mui/material";
import { useRebelPrincessGameContext } from "../../context/RebelPrincessGameContext";
import type { RPRoundModifier } from "../../lib/types";
import { toast } from "react-toastify";

export default function RoundResult() {
    const navigate = useNavigate();
    const { players } = useRebelPrincessGameContext();
    const roundModifiers: RPRoundModifier[] = initializeAvailableRoundModifiers();

    const [roundModifier, setRoundModifier] = useState<RPRoundModifier | undefined>(undefined)
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (players.length < 3 || players.length > 6) {
            navigate("/rebel-princess/new");
        }
    }, [players, navigate]);

    const handleSubmit = async () => {
        setError(null);
        toast.info("work in progress, coming soon™")
    };

    function initializeAvailableRoundModifiers(): RPRoundModifier[] {
        return [
            { id: "a", name: "Es war einmal ..."},
            { id: "b", name: "todo"},
            { id: "c", name: "todo"},
            { id: "d", name: "todo"},
            { id: "e", name: "todo"},
            { id: "f", name: "todo"},
            { id: "g", name: "todo"},
            { id: "h", name: "todo"},
            { id: "i", name: "todo"},
            { id: "j", name: "todo"},
            { id: "k", name: "todo"},
            { id: "l", name: "todo"},
            { id: "m", name: "todo"},
            { id: "n", name: "todo"},
            { id: "o", name: "todo"},
            { id: "p", name: "todo"},
            { id: "q", name: "todo"},
            { id: "r", name: "todo"},
            { id: "s", name: "todo"},
            { id: "t", name: "todo"},
            { id: "u", name: "todo"},
        ]
    }

    return (
        <Box maxWidth={800} mx="auto" p={2}>
            <Typography variant="h5" gutterBottom>
                Enter Round Results
            </Typography>
            <Grid sx={{ xs: 12, md: 6 }}>
                <Autocomplete
                    sx={{ minWidth: "100px" }}
                    options={roundModifiers.map((modifier) => modifier.id)}
                    value={roundModifier !== undefined ? roundModifier.id : null}
                    onChange={(_, value) => value !== null && setRoundModifier(roundModifiers.find((modifier) => modifier.id === value))}
                    disableCloseOnSelect
                    renderInput={(params) => <TextField {...params} label="Round modifier" />}
                />
            </Grid>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell>Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map((player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>
                                <TextField></TextField>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {error && (
                <Typography color="error" mt={2}>
                    Error: {error}
                </Typography>
            )}

            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Round
                </Button>
            </Box>
        </Box>
    );
}

