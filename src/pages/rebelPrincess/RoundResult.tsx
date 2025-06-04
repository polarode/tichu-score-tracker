import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Typography,
    Box,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { useRebelPrincessGameContext } from "../../context/RebelPrincessGameContext";
import type { RPRoundModifier } from "../../lib/types";
import { toast } from "react-toastify";

export default function RoundResult() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const { players } = useRebelPrincessGameContext();
    const roundModifiers: RPRoundModifier[] = initializeAvailableRoundModifiers();

    const [roundModifier, setRoundModifier] = useState<RPRoundModifier | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        console.log(roundModifier);
    }, [roundModifier]);

    useEffect(() => {
        if (players.length < 3 || players.length > 6) {
            navigate("/rebel-princess/new");
        }
    }, [players, navigate]);

    const handleSubmit = async () => {
        setError(null);
        toast.info("work in progress, coming soon™");
    };

    function initializeAvailableRoundModifiers(): RPRoundModifier[] {
        return [
            { id: "a", name: "Es war einmal ..." },
            { id: "b", name: "Einladung" },
            { id: "c", name: "Maskenball" },
            { id: "d", name: "Königliches Dekret" },
            { id: "e", name: "Stuhltanz" },
            { id: "f", name: "Tierisch gemein" },
            { id: "g", name: "Späte Gäste" },
            { id: "h", name: "Vergifteter Apfel" },
            { id: "i", name: "Gläserner Schuh" },
            { id: "j", name: "Verkehrte Welt" },
            { id: "k", name: "Ballköniginnen" },
            { id: "l", name: "Wenn der Prinz zweimal klingelt" },
            { id: "m", name: "Hochzeitsgeschenk" },
            { id: "n", name: "Reste-Party" },
            { id: "o", name: "Frischmachen" },
            { id: "p", name: "Single-Feen" },
            { id: "q", name: "Blindes Huhn" },
            { id: "r", name: "Nächtliche Verwandlung" },
            { id: "s", name: "Brautstrauß" },
            { id: "t", name: "Tauschhandel" },
            { id: "u", name: "Gerade und ungerade" },
        ];
    }

    return (
        <Box maxWidth={800} mx="auto" p={2}>
            <Typography variant="h5" gutterBottom>
                Enter Round Results
            </Typography>
            <Grid sx={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                    <InputLabel id="roundModifier">Round modifier</InputLabel>
                    <Select
                        fullWidth={true}
                        value={roundModifier?.id}
                        onChange={(_, value) =>
                            value !== null && setRoundModifier(roundModifiers.find((modifier) => modifier.id === value))
                        }
                        label="Round modifier"
                        labelId="roundModifier"
                    >
                        {roundModifiers.map((rm) => (
                            <MenuItem value={rm.id}>
                                ({rm.id}) {rm.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
