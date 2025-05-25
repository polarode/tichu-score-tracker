import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
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
import { useGameContext } from "../context/GameContext";

type TeamScores = { [key: number]: number };
type TichuCall = "NONE" | "SMALL" | "GRAND";

export default function GameResult() {
    const navigate = useNavigate();
    const { team1, team2 } = useGameContext();

    const players = [...team1, ...team2];
    const teams = [...team1.map(() => 1), ...team2.map(() => 2)];

    const [positions, setPositions] = useState<(number | null)[]>([null, null, null, null]);
    const [tichuCalls, setTichuCalls] = useState<TichuCall[]>(["NONE", "NONE", "NONE", "NONE"]);
    const [teamScores, setTeamScores] = useState<TeamScores>({ 1: 0, 2: 0 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (team1.length !== 2 || team2.length !== 2) {
            navigate("/new");
        }
    }, [team1, team2, navigate]);

    const handleTeam1ScoreChange = (_event: Event, value: number | number[]) => {
        const score = Array.isArray(value) ? value[0] : value;
        setTeamScores({
            1: score,
            2: 100 - score,
        });
    };

    const handlePositionChange = (
        idx: number,
        newPos: number | null,
        positions: (number | null)[],
        setPositions: React.Dispatch<React.SetStateAction<(number | null)[]>>,
    ) => {
        if (newPos === null) {
            // User unselected position -> just clear it
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
            console.log(updated);
            return updated;
        });
    };

    const handleSubmit = async () => {
        setError(null);

        const entry = {
            players,
            teams,
            positions,
            tichu_calls: tichuCalls,
            team_scores: teamScores,
            timestamp: new Date().toISOString(),
        };

        const { error } = await supabase.from("games").insert(entry);

        if (error) {
            setError(error.message);
        } else {
            navigate("/");
        }
    };

    return (
        <Box maxWidth={800} mx="auto" p={2}>
            <Typography variant="h5" gutterBottom>
                Enter Game Results
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell>Finish Position</TableCell>
                        <TableCell>Tichu</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map((player, idx) => (
                        <TableRow key={idx}>
                            {idx % 2 == 0 ? <TableCell rowSpan={2}>{teams[idx]}</TableCell> : <></>}
                            <TableCell>{player}</TableCell>
                            <TableCell>
                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={positions[idx]}
                                    onChange={(_, newVal) => handlePositionChange(idx, newVal, positions, setPositions)}
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box display="flex" justifyContent="space-between" mb={2}>
                {[1, 2].map((team) => (
                    <Box key={team} display="flex" flexDirection="column" alignItems="center" minWidth={80}>
                        <Typography>Team {team} Score</Typography>
                        <Typography variant="h6">{teamScores[team]}</Typography>
                    </Box>
                ))}
            </Box>
            <Slider
                value={teamScores[1]}
                min={-25}
                max={125}
                step={5}
                onChange={handleTeam1ScoreChange}
                valueLabelDisplay="auto"
            />

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
