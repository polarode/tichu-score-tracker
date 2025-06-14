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
} from "@mui/material";
import { useTichuGameContext } from "../../context/TichuGameContext";
import { toast } from "react-toastify";

type TichuCall = "NONE" | "ST" | "GT";

const TICHU_POINTS = 100;
const GRAND_TICHU_POINTS = 200;
const DOUBLE_WIN_POINTS = 200;

export default function GameResult() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const { team1, team2 } = useTichuGameContext();

    const players = [...team1, ...team2];
    const teams = [...team1.map(() => 1), ...team2.map(() => 2)];

    const [positions, setPositions] = useState<(number | null)[]>([null, null, null, null]);
    const [tichuCalls, setTichuCalls] = useState<TichuCall[]>(["NONE", "NONE", "NONE", "NONE"]);
    const [bombCounts, setBombCounts] = useState<number[]>([0, 0, 0, 0]);
    const [teamScores, setTeamScores] = useState<number[]>([50, 50]);
    const [doubleWinTeam, setDoubleWinTeam] = useState<number | null>(null);
    const [teamTotalScores, setTeamTotalScores] = useState<number[]>([0, 0]);
    const [error, setError] = useState<string | null>(null);

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

    const handlePositionChange = (idx: number, newPos: number | null, positions: (number | null)[]) => {
        if (newPos === null) {
            const updated = [...positions];
            updated[idx] = null;
            setPositions(updated);
            return;
        }

        // Check if newPos is already selected by another player
        const takenByIdx = positions.findIndex((pos, i) => pos === newPos && i !== idx);

        const updated = [...positions];

        if (takenByIdx === -1) {
            // Position not taken — just assign it
            updated[idx] = newPos;
        } else {
            // Swap positions between idx and takenByIdx
            updated[takenByIdx] = updated[idx];
            updated[idx] = newPos;
        }

        setPositions(updated);
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

    const handleSubmit = async () => {
        setError(null);

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
        });

        if (error) {
            toast.success("Error inserting game:" + error.message);
        } else {
            toast.success("Game saved successfully!");
            navigate("/");
        }
    };

    return (
        <Box maxWidth={600} mx="auto" p={2}>
            <Typography variant="h5" gutterBottom>
                Enter Game Results
            </Typography>

            <Table sx={{ "& .MuiTableCell-root": { py: 2, px: 1 } }}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell>Finish Order</TableCell>
                        <TableCell>Tichu</TableCell>
                        <TableCell>Bombs</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map((player, idx) => (
                        <TableRow key={idx}>
                            {idx % 2 == 0 ? <TableCell rowSpan={2}>{teams[idx]}</TableCell> : <></>}
                            <TableCell>
                                {player.name} {"💣".repeat(bombCounts[idx])}
                            </TableCell>
                            <TableCell>
                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={positions[idx]}
                                    onChange={(_, newVal) => handlePositionChange(idx, newVal, positions)}
                                    aria-label={`Finish position for player ${player}`}
                                >
                                    {[1, 2, 3, 4].map((pos) => (
                                        <ToggleButton key={pos} value={pos} aria-label={`Position ${pos}`}>
                                            {pos}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </TableCell>
                            <TableCell>
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
                            <TableCell>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{ minWidth: "36px", height: "32px" }}
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
                                    💣
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box display="flex" justifyContent="space-between" mb={2} sx={{ mt: 4 }}>
                {[1, 2].map((team) => (
                    <Box key={team} display="flex" flexDirection="column" alignItems="center" minWidth={80}>
                        <Typography>Team {team} Score</Typography>
                        <Typography variant="h6">{doubleWinTeam != null ? 0 : teamScores[team - 1]}</Typography>
                    </Box>
                ))}
            </Box>
            <Slider
                value={teamScores[0]}
                min={-25}
                max={125}
                step={5}
                disabled={doubleWinTeam != null}
                onChange={handleTeam1ScoreChange}
                valueLabelDisplay="auto"
            />

            <Box display="flex" justifyContent="space-between" mb={2}>
                {[1, 2].map((team) => (
                    <Box key={team} display="flex" flexDirection="column" alignItems="center" minWidth={80}>
                        <Typography>with bonus points</Typography>
                        <Typography variant="h6">{teamTotalScores[team - 1]}</Typography>
                    </Box>
                ))}
            </Box>

            {error && (
                <Typography color="error" mt={2}>
                    Error: {error}
                </Typography>
            )}

            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Game
                </Button>
            </Box>
        </Box>
    );
}
