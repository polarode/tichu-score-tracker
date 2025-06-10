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
    const [playerPoints, setPlayerPoints] = useState<number[]>(new Array(players.length).fill(0));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (players.length < 3 || players.length > 6) {
            navigate("/rebel-princess/new");
        }
    }, [players, navigate]);

    const handleSubmit = async () => {
        setError(null);
        if (!roundModifier) {
            toast.error("Please select a round modifier");
            return;
        }
        const [minPoints, maxPoints] = calculateRoundPoints(players.length, roundModifier);
        const totalPoints = playerPoints.reduce((sum, points) => sum + points, 0);

        // Validate points are in valid range
        if (totalPoints < minPoints || totalPoints > maxPoints) {
            toast.error(`Total points must be between ${minPoints} and ${maxPoints}`);
            return;
        }

        // todo: save logic here
        toast.info("Your points seem to be valid. I would now save the game, if I had already implemented that");
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

    function getCardsPerColor(numberOfPlayers: number): number {
        switch (numberOfPlayers) {
            case 3:
                return 9; // Cards 2-10
            case 4:
            case 5:
                return 10; // Cards 1-10
            case 6:
                return 12; // Cards 1-12
            default:
                throw new Error(`Invalid number of players: ${numberOfPlayers}. Must be 3, 4, 5, or 6.`);
        }
    }

    // Calculate the minimum and maximum possible points for a round of Rebel Princess
    function calculateRoundPoints(numberOfPlayers: number, roundModifier?: RPRoundModifier): [number, number] {
        if (![3, 4, 5, 6].includes(numberOfPlayers)) {
            throw new Error(`Invalid number of players: ${numberOfPlayers}. Must be 3, 4, 5, or 6.`);
        }

        const cardsPerColor = getCardsPerColor(numberOfPlayers);
        let basePointsPerPrinceCard = 1;
        const frogPoints = 5;
        const additionalPointsForNumberMatchingQueenPrinceMatches = 2;
        const additionalPointsPerAnimalCard = 1;
        const additionalPointsPerFairyCard = -1;

        let min = cardsPerColor * basePointsPerPrinceCard + frogPoints;
        let max = min;

        // Apply round modifiers that affect points
        if (roundModifier?.id === "f") {
            min += cardsPerColor * additionalPointsPerAnimalCard;
            max = min;
        } else if (roundModifier?.id === "k") {
            max += cardsPerColor * additionalPointsForNumberMatchingQueenPrinceMatches;
        } else if (roundModifier?.id === "o") {
            basePointsPerPrinceCard = 2;
            max = cardsPerColor * basePointsPerPrinceCard + frogPoints;
        } else if (roundModifier?.id === "p") {
            min += cardsPerColor * additionalPointsPerFairyCard;
            max = min;
        }
        return [min, max];
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
                        value={roundModifier}
                        onChange={(event) => {
                            const selectedId = event.target.value;
                            console.log(selectedId);
                            if (selectedId) {
                                const selectedModifier = roundModifiers.find((modifier) => modifier.id === selectedId);
                                setRoundModifier(selectedModifier);
                            }
                        }}
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
                                <TextField
                                    type="number"
                                    value={playerPoints[idx]}
                                    onChange={(e) => {
                                        const newPoints = [...playerPoints];
                                        newPoints[idx] = Number(e.target.value) || 0;
                                        setPlayerPoints(newPoints);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell>
                            <strong>Total</strong>
                        </TableCell>
                        <TableCell>
                            <strong>{playerPoints.reduce((sum, points) => sum + points, 0)}</strong>
                        </TableCell>
                    </TableRow>
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
