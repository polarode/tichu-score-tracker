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
    Tooltip,
    CircularProgress,
    Backdrop,
    IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRebelPrincessGameContext } from "../../context/RebelPrincessGameContext";
import type { RPRoundModifier } from "../../lib/types";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase";
import { PageTemplate } from "../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

type SavedRound = {
    modifier: RPRoundModifier;
    points: number[];
};

export default function RoundResult() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const { players, gameId } = useRebelPrincessGameContext();
    const roundModifiers: RPRoundModifier[] = initializeAvailableRoundModifiers();

    const [roundModifier, setRoundModifier] = useState<RPRoundModifier | undefined>(undefined);
    const [playerPoints, setPlayerPoints] = useState<number[]>(new Array(players.length).fill(0));
    const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (players.length < 3 || players.length > 6 || !gameId) {
            navigate("/rebel-princess/new");
        }
    }, [players, gameId, navigate]);

    const handleSubmit = async () => {
        if (isSaving) return;

        setError(null);
        setIsSaving(true);

        try {
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

            if (!gameId) {
                throw new Error("No game ID found");
            }

            const playerIds = players.map((player) => player.id);

            const { error: dbError } = await supabase.rpc("insert_rebel_princess_round", {
                p_game_id: gameId,
                p_players: playerIds,
                p_points: playerPoints,
                p_round_modifier: roundModifier.id,
            });

            if (dbError) {
                throw dbError;
            }

            // Add the saved round to the state
            setSavedRounds([
                ...savedRounds,
                {
                    modifier: roundModifier,
                    points: [...playerPoints],
                },
            ]);

            toast.success("Round saved successfully!");
            setPlayerPoints(new Array(players.length).fill(0));
            setRoundModifier(undefined);
        } catch (err) {
            console.error("Error saving round:", err);
            toast.error("Failed to save round. Please try again.");
            setError("Failed to save round data");
        } finally {
            setIsSaving(false);
        }
    };

    function initializeAvailableRoundModifiers(): RPRoundModifier[] {
        return [
            { id: "-", name: "ohne", description: "", team: false },
            { id: "a", name: "Es war einmal ...", description: "", team: false },
            { id: "b", name: "Einladung", description: "", team: false },
            { id: "c", name: "Maskenball", description: "", team: false },
            { id: "d", name: "Königliches Dekret", description: "", team: false },
            { id: "e", name: "Stuhltanz", description: "", team: false },
            { id: "f", name: "Tierisch gemein", description: "", team: false },
            { id: "g", name: "Späte Gäste", description: "", team: false },
            { id: "h", name: "Vergifteter Apfel", description: "", team: false },
            { id: "i", name: "Gläserner Schuh", description: "", team: false },
            { id: "j", name: "Verkehrte Welt", description: "", team: false },
            { id: "k", name: "Ballköniginnen", description: "", team: false },
            { id: "l", name: "Wenn der Prinz zweimal klingelt", description: "", team: false },
            { id: "m", name: "Hochzeitsgeschenk", description: "", team: false },
            { id: "n", name: "Reste-Party", description: "", team: false },
            { id: "o", name: "Frischmachen", description: "", team: false },
            { id: "p", name: "Single-Feen", description: "", team: false },
            { id: "q", name: "Blindes Huhn", description: "", team: false },
            { id: "r", name: "Nächtliche Verwandlung", description: "", team: false },
            { id: "s", name: "Brautstrauß", description: "", team: false },
            { id: "t", name: "Tauschhandel", description: "", team: false },
            { id: "u", name: "Gerade und ungerade", description: "", team: false },
            {
                id: "eg",
                name: "Die alte Leier",
                description:
                    "Jeder Prinz zählt in dieserRunde als -1 Antrag. Es ist also ratsam, Stiche mitPrinzen zu gewinnen. Der Frosch hingegen zähltweiterhin als 5 Anträge.",
                team: false,
            },
            {
                id: "eh",
                name: "Vererbt",
                description:
                    "Gewinnst du den letzten Stich, gibst du alle deine gewonnenen Stiche der Person zu deiner Linken.",
                team: false,
            },
            {
                id: "ei",
                name: "Hochzeitsüberraschung",
                description:
                    "Wer einen Stich beginnt, spielt die erste Karte verdeckt und sagt nur die Farbe der gespielten Karte an. Erst wenn alle eine Karte ausgespielt haben, wird die verdeckte Karte umgedreht und geprüft, wer den Stich gewonnen hat. \nMulan und die jüngere Stiefschwester können die erste Karte des Stichs nur gegen eine Karte der gleichen Farbe tauschen.",
                team: false,
            },
            {
                id: "ej",
                name: "Durchzug",
                description:
                    "Vor dem ersten Stich wählt ihr alle je 2 Karten aus eurer Hand, legt diese verdeckt vor euch ab und gebt die restlichen Karten an die Person zu eurer Linken. Wiederholt das mit den Karten, die ihr von rechts bekommen habt, bis ihr keine Karten mehr weitergeben könnt. Nehmt dann alle Karten vor euch auf die Hand und beginnt die Runde.",
                team: false,
            },
            {
                id: "ek",
                name: "Vergiftetes Geschenk",
                description:
                    "Zu Beginn der Runde legen alle je eine Karte verdeckt auf einen gemeinsamen Stapel. Legt die Hilfskarte Vergiftetes Geschenk auf diesen Stapel und gebt ihn der Person, die den ersten Stich beginnen wird. Gewinnt die Person, die den Stapel hat, einen Stich, gibt sie den Stapel mit dem vergifteten Geschenk an eine beliebige andere Person. Am Ende der Runde zählt der Stapel wie ein gewonnener Stich für die Person, die ihn in dem Moment besitzt.",
                team: false,
            },
            {
                id: "el",
                name: "Geheimes Gebot",
                description:
                    "Vor dem ersten Stich, nach der Weitergabe der Karten, legt ihr alle je eine Karte aus eurer Hand verdeckt unter eure Prinzessinnen-Karte. Dies darf, wenn möglich, kein Prinz oder der Frosch sein. Erst am Ende der Runde, nach dem letzten Stich, deckt ihr eure Karte auf. Entspricht die Zahl auf der Karte der Anzahl eurer gewonnenen Stiche in dieser Runde, ignoriert ihr alle erhalteten Anträge und wertet stattdessen -1 Antrag für jeden gewonnenen Stich. Andernfalls wertet ihr wie gewohnt die erhaltenen Anträge.",
                team: false,
            },
            {
                id: "em",
                name: "Ein verzauberter Abend",
                description:
                    "Vor dem ersten Stich, nach der Weitergabe der Karten, legt ihr alle gleichzeitig je eine Karte mit Wert kleiner als 8 aus eurer Hand auf den Tisch. Addiert die Werte dieser Karten zur Zielsumme und legt die Karten dann beiseite. Sie werden in dieser Runde nicht mehr benötigt. Während jedes Stichs addiert ihr nun die Werte der in diesem Stich gespielten Karten. Überschreitet eine Person mit ihrer ausgespielten Karte die Zielsumme, gewinnt sie den Stich. Überschreitet die Summe der Werte im Stich die Zielsumme nicht, überprüft ihr wie gewohnt, wer den Stich gewonnen hat. Hat mindestens eine Person nach der Weitergabe der Karten keine Karte mit Wert kleiner als 8, beginnt ihr diese Runde neu. Mischt alle Karten und teilt sie neu aus. \nSchneewittchen kann während eines Stichs wie gewohnt ihre Fähigkeit nutzen und den Wert einer Karte zu 0 machen, um die Zielsumme nicht zu überschreiten. Mulan, die Herzkönigin und die jüngere Stiefschwester hingegen können ihre Fähigkeiten nicht einsetzen um zu verändern, wer die Zielsumme in einem Stich überschritten hat. Sie können ihre Fähigkeiten aber einsetzen, wenn der Stich nach den gewohnten Regeln verteilt wird.",
                team: false,
            },
            {
                id: "en",
                name: "Böse, aber willkommen",
                description:
                    "Die Weitergabe der Karten zu Beginn der Runde erfolgt nur zwischen den Mitgliedern des jeweiligen Teams. Diese Runden-Karte wird für die erste Partie im Team-Modus empfohlen.",
                team: true,
            },
            {
                id: "eo",
                name: "Partnerlook",
                description:
                    "Haben am Ende einer Runde beide Mitglieder eines Teams dieselbe Anzahl an gewonnenen Stichen, erhalten sie -3 Anträge zu ihrem Teamergebnis. Ansonsten erhalten sie zusätzliche 3 Anträge.",
                team: true,
            },
            {
                id: "ep",
                name: "Yin und Yang",
                description:
                    "In jedem Stich spielt die erste Person eines Teams ihre Karte wahlweise offen oder verdeckt. Die zweite Person spielt ihre Karte auf die andere Weise. Erst am Ende eines Stichs werden alle verdeckten Karten aufgedeckt. Beginnt eine Person den Stich mit einer verdeckten Karte, muss sie die gespielte Farbe ansagen.",
                team: true,
            },
            {
                id: "eq",
                name: "Doppel-Date",
                description:
                    "Am Ende jedes Stichs addieren die Teammitglieder ihre gespielten Karten der Trumpffarbe. Das Team mit der höchsten Summe gewinnt den Stich. Bei Gleichstand gewinnt das Team mit der höherwertigeren Einzelkarte. Das Teammitglied mit der höherwertigeren Einzelkarte in der Trumpffarbe erhält auch den Stich.",
                team: true,
            },
            {
                id: "er",
                name: "Seelenverwandt",
                description:
                    "Können beide Teammitglieder in einem Stich die Trumpffarbe nicht bedienen, zählen ihre gespielten Karten zur Trumpffarbe. Bei Gleichstand gewinnt, wer zuerst die Karte gespielt hat.",
                team: true,
            },
            {
                id: "es",
                name: "Lieber Single",
                description:
                    "Vergleicht am Ende der Runde die gewonnenen Stiche innerhalb eures Teams. Für jedes Zahlenpaar, für das jede Person des Teams eine Karte beisteuern kann, erhaltet ihr zusätzlich 1 Antrag für das Teamergebnis.",
                team: true,
            },
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
        const totalCards = cardsPerColor * 4;
        const rounds = totalCards / numberOfPlayers;
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
        } else if (roundModifier?.id === "eg") {
            min = cardsPerColor * -1 * additionalPointsPerFairyCard + frogPoints;
            max = min;
        } else if (roundModifier?.id === "el") {
            min = -1 * rounds;
        } else if (roundModifier?.id === "en") {
            min = min * 2;
            max = max * 2;
        } else if (roundModifier?.id === "eo") {
            min = (min - (numberOfPlayers / 2) * 3) * 2;
            max = (max + (numberOfPlayers / 2) * 3) * 2;
        } else if (roundModifier?.id === "ep") {
            min = min * 2;
            max = max * 2;
        } else if (roundModifier?.id === "eq") {
            min = min * 2;
            max = max * 2;
        } else if (roundModifier?.id === "er") {
            min = min * 2;
            max = max * 2;
        } else if (roundModifier?.id === "es") {
            min = min * 2;
            max = (max + 12) * 2;
        }
        return [min, max];
    }

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Typography variant="h5" gutterBottom>
                <Trans>Enter Round Results</Trans>
            </Typography>
            <Grid sx={{ xs: 12, md: 6, display: "flex", alignItems: "center", gap: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="roundModifier">
                        <Trans>Round modifier</Trans>
                    </InputLabel>
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
                        label={<Trans>Round modifier</Trans>}
                        labelId="roundModifier"
                    >
                        {roundModifiers.map((rm) => (
                            <MenuItem value={rm.id}>
                                ({rm.id}) {rm.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <IconButton size="small" onClick={() => setShowDescription((prev) => !prev)}>
                    <InfoOutlinedIcon fontSize="small" />
                </IconButton>
            </Grid>
            <Box sx={{ overflowX: "auto" }}>
                {showDescription && (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        {roundModifier?.description}
                    </Typography>
                )}
                <Table sx={{ minWidth: 300 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ position: "sticky", left: 0, background: "white", padding: "8px", zIndex: 1 }}
                            >
                                <Trans>Player</Trans>
                            </TableCell>
                            {savedRounds.map((round, idx) => (
                                <TableCell sx={{ minWidth: 55, padding: "8px" }} key={idx} align="center">
                                    <Tooltip
                                        title={`(${round.modifier.id}) ${round.modifier.name}`}
                                        arrow
                                        disableFocusListener={false}
                                        disableTouchListener={false}
                                        enterTouchDelay={0}
                                    >
                                        <span>
                                            <Trans>Round {idx + 1}</Trans>
                                        </span>
                                    </Tooltip>
                                </TableCell>
                            ))}
                            <TableCell sx={{ minWidth: 55, padding: "8px" }}>
                                <Tooltip
                                    title={`(${roundModifier?.id}) ${roundModifier?.name}`}
                                    arrow
                                    disableFocusListener={false}
                                    disableTouchListener={false}
                                    enterTouchDelay={0}
                                >
                                    <span>
                                        <Trans>Round {savedRounds.length + 1}</Trans>
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                                <Trans>Total</Trans>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player, idx) => (
                            <TableRow key={idx}>
                                <TableCell
                                    align="left"
                                    sx={{ position: "sticky", left: 0, background: "white", padding: "8px", zIndex: 1 }}
                                >
                                    {player.name}
                                </TableCell>
                                {savedRounds.map((round, roundIdx) => (
                                    <TableCell key={roundIdx} align="center" sx={{ padding: "8px" }}>
                                        {round.points[idx]}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ padding: "8px" }}>
                                    <TextField
                                        type="number"
                                        value={playerPoints[idx] === 0 ? "" : playerPoints[idx].toString()}
                                        variant="standard"
                                        onChange={(e) => {
                                            const newPoints = [...playerPoints];
                                            const inputValue = e.target.value;

                                            if (inputValue === "") {
                                                newPoints[idx] = 0;
                                            } else {
                                                newPoints[idx] = Number(inputValue) || 0;
                                            }

                                            setPlayerPoints(newPoints);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ padding: "8px" }}>
                                    <strong>
                                        {savedRounds.reduce((sum, round) => sum + round.points[idx], 0) +
                                            playerPoints[idx]}
                                    </strong>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ position: "sticky", left: 0, background: "white", zIndex: 1 }}>
                                <strong>
                                    <Trans>Total</Trans>
                                </strong>
                            </TableCell>
                            {savedRounds.map((round, idx) => (
                                <TableCell key={idx} align="center">
                                    <strong>{round.points.reduce((sum, p) => sum + p, 0)}</strong>
                                </TableCell>
                            ))}
                            <TableCell>
                                <strong>{playerPoints.reduce((sum, points) => sum + points, 0)}</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>
                                    {savedRounds.reduce(
                                        (sum, round) => sum + round.points.reduce((s, p) => s + p, 0),
                                        0,
                                    ) + playerPoints.reduce((sum, points) => sum + points, 0)}
                                </strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {error && (
                    <Typography color="error" mt={2}>
                        Error: {error}
                    </Typography>
                )}
            </Box>
            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSaving}>
                    <Trans>Save Round</Trans>
                </Button>
            </Box>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSaving}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </PageTemplate>
    );
}
