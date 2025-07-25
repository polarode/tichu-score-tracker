import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Typography,
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Slider,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import { useTichuGameContext } from "../../context/TichuGameContext";
import { toast } from "react-toastify";
import type { MatchStandings } from "../../lib/types";
import { PageTemplate } from "../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

type TichuCall = "NONE" | "ST" | "GT";

const TICHU_POINTS = 100;
const GRAND_TICHU_POINTS = 200;
const DOUBLE_WIN_POINTS = 200;

export default function GameResult() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const { team1, team2, currentMatch, setCurrentMatch, setMatchStandings } = useTichuGameContext();

    const players = [...team1, ...team2];
    const teams = [...team1.map(() => 1), ...team2.map(() => 2)];

    const [positions, setPositions] = useState<(number | null)[]>([null, null, null, null]);
    const [tichuCalls, setTichuCalls] = useState<TichuCall[]>(["NONE", "NONE", "NONE", "NONE"]);
    const [bombCounts, setBombCounts] = useState<number[]>([0, 0, 0, 0]);
    const [teamScores, setTeamScores] = useState<number[]>([50, 50]);
    const [doubleWinTeam, setDoubleWinTeam] = useState<number | null>(null);
    const [teamTotalScores, setTeamTotalScores] = useState<number[]>([0, 0]);
    const [error, setError] = useState<string | null>(null);
    const [beschissFlag, setBeschissFlag] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (team1.length !== 2 || team2.length !== 2) {
            navigate("/tichu/new");
        }
    }, [team1, team2, navigate]);

    useEffect(() => updateDoubleWin(), [positions]);
    useEffect(() => updateBonusPoints(), [tichuCalls, teamScores, positions, doubleWinTeam]);

    const handleTeam1ScoreChange = (_event: Event, value: number | number[]) => {
        const score = Array.isArray(value) ? value[0] : value;
        setTeamScores([score, 100 - score]);
    };

    const handleTichuCallChange = (
        idx: number,
        newTichuCall: TichuCall,
        setTichuCalls: React.Dispatch<React.SetStateAction<TichuCall[]>>,
    ) => {
        if (newTichuCall === null) {
            newTichuCall = "NONE";
        }
        setTichuCalls((prev) => {
            const updated = [...prev];
            updated[idx] = newTichuCall;
            return updated;
        });
    };

    const updateDoubleWin = () => {
        const firstIndex = positions.findIndex((pos) => pos === 1);
        const secondIndex = positions.findIndex((pos) => pos === 2);
        if (teams[firstIndex] === teams[secondIndex]) {
            setDoubleWinTeam(teams[firstIndex]);
        } else {
            setDoubleWinTeam(null);
        }
    };

    const updateBonusPoints = () => {
        const baseTeamScores = { ...teamScores };

        const bonusPoints = [0, 0];

        players.forEach((_, idx) => {
            const call = tichuCalls[idx];
            const success = positions[idx] === 1;
            const team: number = teams[idx] - 1;

            if (call === "ST") {
                bonusPoints[team] += success ? TICHU_POINTS : -TICHU_POINTS;
            } else if (call === "GT") {
                bonusPoints[team] += success ? GRAND_TICHU_POINTS : -GRAND_TICHU_POINTS;
            }
        });

        if (doubleWinTeam !== null) {
            bonusPoints[doubleWinTeam - 1] += DOUBLE_WIN_POINTS;
        }

        setTeamTotalScores([
            (doubleWinTeam == null ? baseTeamScores[0] : 0) + bonusPoints[0],
            (doubleWinTeam == null ? baseTeamScores[1] : 0) + bonusPoints[1],
        ]);
    };

    const checkMatchCompletion = async () => {
        if (!currentMatch) return;

        try {
            const { data: standings, error } = await supabase.rpc("get_match_standings", {
                p_match_id: currentMatch.id,
            });

            if (error) throw error;

            setMatchStandings(standings as MatchStandings);

            const winningTeam = standings?.find(
                (s: { total_score: number }) => s.total_score >= currentMatch.target_points,
            );

            if (winningTeam) {
                await supabase
                    .from("match_series")
                    .update({ status: "completed", winning_team: winningTeam.team })
                    .eq("id", currentMatch.id);

                setCurrentMatch(null);
                toast.success(`Match completed! Team ${winningTeam.team} wins with ${winningTeam.total_score} points!`);
                navigate("/");
            } else {
                navigate("/tichu/match-progress");
            }
        } catch (err) {
            console.error("Error checking match completion:", err);
            navigate("/");
        }
    };

    const handleSubmit = async () => {
        if (isSaving) return;

        setError(null);
        setIsSaving(true);

        try {
            if (positions.some((pos) => pos === null)) {
                setError("Please set the finishing position for all players.");
                return;
            }

            const uniquePositions = new Set(positions);
            if (uniquePositions.size !== 4 || ![1, 2, 3, 4].every((n) => uniquePositions.has(n))) {
                setError("Positions must be unique and between 1 and 4.");
                return;
            }

            const { error } = await supabase.rpc("insert_tichu_game", {
                p_players: players.map((p) => p.id),
                p_teams: [1, 1, 2, 2],
                p_positions: positions,
                p_tichu_calls: tichuCalls,
                p_bomb_count: bombCounts,
                p_double_wins: doubleWinTeam == 1 ? [true, false] : doubleWinTeam == 2 ? [false, true] : [false, false],
                p_scores: doubleWinTeam != null ? [0, 0] : teamScores,
                p_total_scores: teamTotalScores,
                p_beschiss: beschissFlag,
                p_match_id: currentMatch?.id || null,
            });

            if (error) {
                toast.error("Error inserting game: " + error.message);
            } else {
                toast.success("Game saved successfully!");

                if (currentMatch) {
                    await checkMatchCompletion();
                } else {
                    navigate("/");
                }
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PageTemplate maxWidth="md" showVersionButton={false}>
            <Typography variant="h5" gutterBottom>
                <Trans>Enter Game Results</Trans>
            </Typography>

            <Table sx={{ "& .MuiTableCell-root": { py: 1, px: 1 } }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={2}>
                            Team 1
                        </TableCell>
                        <TableCell align="center" colSpan={2}>
                            Team 2
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {players.map((player) => (
                            <TableCell align="center">{player.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {players.map((player, idx) => (
                            <TableCell align="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        minWidth: "36px",
                                        height: "32px",
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}></Box>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    >
                                        {positions[idx] === null ? (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    minWidth: "36px",
                                                    height: "32px",
                                                }}
                                                aria-label={`Set the finishing order for ${player} to the next available position`}
                                                onClick={() => {
                                                    setPositions((prev) => {
                                                        const newPositions = [...prev];
                                                        // Find the lowest number from 1-4 that's not already used
                                                        const usedPositions = new Set(
                                                            newPositions.filter((p) => p !== null),
                                                        );
                                                        for (let i = 1; i <= 4; i++) {
                                                            if (!usedPositions.has(i)) {
                                                                newPositions[idx] = i;
                                                                break;
                                                            }
                                                        }
                                                        return newPositions;
                                                    });
                                                }}
                                            >
                                                Finish
                                            </Button>
                                        ) : (
                                            <Typography>{positions[idx]}.</Typography>
                                        )}
                                    </Box>
                                    {positions[idx] !== null && (
                                        <Button
                                            size="small"
                                            sx={{
                                                minWidth: "36px",
                                                height: "32px",
                                            }}
                                            aria-label={`Reset the finishing order for ${player}`}
                                            onClick={() => {
                                                setPositions((prev) => {
                                                    const newPositions = [...prev];
                                                    newPositions[idx] = null;
                                                    return newPositions;
                                                });
                                            }}
                                        >
                                            🗑️
                                        </Button>
                                    )}
                                </Box>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow>
                        {players.map((player, idx) => (
                            <TableCell align="center">
                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={tichuCalls[idx]}
                                    onChange={(_, newVal) => handleTichuCallChange(idx, newVal, setTichuCalls)}
                                    aria-label={`Tichu call for player ${player}`}
                                >
                                    {["ST", "GT"].map((tichu) => (
                                        <ToggleButton key={tichu} value={tichu} aria-label={`Tichu call ${tichu}`}>
                                            {tichu}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {players.map((player, idx) => (
                            <TableCell align="center">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        minWidth: "36px",
                                        height: "32px",
                                        opacity: bombCounts[idx] === 0 ? "60%" : "100%",
                                    }}
                                    aria-label={`Increment bomb count for player ${player}`}
                                    onClick={() => {
                                        setBombCounts((prev) => {
                                            const newCounter = [...prev];
                                            // Increment and wrap around from 3 back to 0
                                            newCounter[idx] = (newCounter[idx] + 1) % 4;
                                            return newCounter;
                                        });
                                    }}
                                >
                                    {bombCounts[idx] === 0 ? "💣" : "💣".repeat(bombCounts[idx])}
                                </Button>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow>
                        {[1, 2].map((team) => (
                            <TableCell align="center" colSpan={2}>
                                <Typography>
                                    <Trans>Score</Trans>
                                </Typography>
                                <Typography variant="h6">{doubleWinTeam != null ? 0 : teamScores[team - 1]}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow>
                        {[1, 2].map((team) => (
                            <TableCell align="center" colSpan={2}>
                                <Typography>
                                    <Trans>with bonus points</Trans>
                                </Typography>
                                <Typography variant="h6">{teamTotalScores[team - 1]}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>

            <Box mb={1} sx={{ mt: 4 }}>
                <Typography variant="caption">
                    <Trans>Team 1 Score</Trans>
                </Typography>
                <Slider
                    value={teamScores[0]}
                    min={-25}
                    max={125}
                    step={5}
                    disabled={doubleWinTeam != null}
                    onChange={handleTeam1ScoreChange}
                    valueLabelDisplay="auto"
                    sx={{ mt: 0 }}
                />
            </Box>

            {error && (
                <Typography color="error" mt={2}>
                    Error: {error}
                </Typography>
            )}

            <Box mt={3} display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSaving}>
                    <Trans>Save Game</Trans>
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setBeschissFlag(!beschissFlag)}
                    sx={{
                        color: beschissFlag ? "white" : "error.main",
                        bgcolor: beschissFlag ? "error.main" : "transparent",
                        borderColor: beschissFlag ? "error.main" : "rgba(0, 0, 0, 0.23)",
                        "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                            borderColor: "error.main",
                        },
                    }}
                >
                    {beschissFlag ? <Trans>Beschiss ✓</Trans> : <Trans>Beschiss</Trans>}
                </Button>
            </Box>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSaving}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </PageTemplate>
    );
}
