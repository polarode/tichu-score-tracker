import { useState, useEffect } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    CircularProgress,
    TableSortLabel,
    TextField,
} from "@mui/material";
import { supabase } from "../../../lib/supabase";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";

interface TeamStatistics {
    player1_id: string;
    player2_id: string;
    player1_name: string;
    player2_name: string;
    games_played: number;
    wins: number;
    losses: number;
    draws: number;
    win_rate: number;
    avg_score: number;
    total_points: number;
}

type SortOption = "wins" | "winRate" | "games" | "avgScore" | "totalPoints";
type SortOrder = "asc" | "desc";

export const TeamRanking = () => {
    const navigate = useNavigate();
    const [teamStats, setTeamStats] = useState<TeamStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("wins");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [minGames, setMinGames] = useState(10);
    const [appliedMinGames, setAppliedMinGames] = useState(10);

    useEffect(() => {
        const fetchTeamStats = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.rpc("get_tichu_team_rankings", { min_games: appliedMinGames });
                if (error) {
                    console.error("Error fetching team stats:", error);
                } else if (data) {
                    setTeamStats(data);
                }
            } catch (error) {
                console.error("Error fetching team stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamStats();
    }, [appliedMinGames]);

    const handleMinGamesBlur = () => {
        setAppliedMinGames(minGames);
    };

    const handleSort = (column: SortOption) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder(column === "games" ? "desc" : "desc");
        }
    };

    const getSortedTeams = () => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        return [...teamStats].sort((a, b) => {
            switch (sortBy) {
                case "winRate":
                    return multiplier * (a.win_rate - b.win_rate);
                case "games":
                    return multiplier * (a.games_played - b.games_played);
                case "avgScore":
                    return multiplier * (a.avg_score - b.avg_score);
                case "totalPoints":
                    return multiplier * (a.total_points - b.total_points);
                case "wins":
                default:
                    return multiplier * (a.wins - b.wins);
            }
        });
    };

    const handleTeamClick = (player1Id: string, player2Id: string) => {
        navigate(`/tichu/stats/team/${player1Id}/${player2Id}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">
                    <Trans>Team Rankings</Trans>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <Trans>Min. Games:</Trans>
                    </Typography>
                    <TextField
                        size="small"
                        type="number"
                        value={minGames}
                        onChange={(e) => setMinGames(Math.max(0, parseInt(e.target.value) || 0))}
                        onBlur={handleMinGamesBlur}
                        sx={{ width: 80 }}
                        inputProps={{ min: 0 }}
                    />
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 60 }}>#</TableCell>
                            <TableCell>
                                <Trans>Team</Trans>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortBy === "games"}
                                    direction={sortBy === "games" ? sortOrder : "desc"}
                                    onClick={() => handleSort("games")}
                                >
                                    <Trans>Games</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortBy === "wins"}
                                    direction={sortBy === "wins" ? sortOrder : "desc"}
                                    onClick={() => handleSort("wins")}
                                >
                                    <Trans>Wins</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <Trans>Losses</Trans>
                            </TableCell>
                            <TableCell align="right">
                                <Trans>Draws</Trans>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortBy === "winRate"}
                                    direction={sortBy === "winRate" ? sortOrder : "desc"}
                                    onClick={() => handleSort("winRate")}
                                >
                                    <Trans>Win Rate</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortBy === "avgScore"}
                                    direction={sortBy === "avgScore" ? sortOrder : "desc"}
                                    onClick={() => handleSort("avgScore")}
                                >
                                    <Trans>Avg Score</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortBy === "totalPoints"}
                                    direction={sortBy === "totalPoints" ? sortOrder : "desc"}
                                    onClick={() => handleSort("totalPoints")}
                                >
                                    <Trans>Total Points</Trans>
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getSortedTeams().map((team, index) => (
                            <TableRow
                                key={`${team.player1_id}-${team.player2_id}`}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleTeamClick(team.player1_id, team.player2_id)}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {team.player1_name} & {team.player2_name}
                                </TableCell>
                                <TableCell align="right">{team.games_played}</TableCell>
                                <TableCell align="right">{team.wins}</TableCell>
                                <TableCell align="right">{team.losses}</TableCell>
                                <TableCell align="right">{team.draws}</TableCell>
                                <TableCell align="right">{team.win_rate}%</TableCell>
                                <TableCell align="right">{Math.round(team.avg_score)}</TableCell>
                                <TableCell align="right">{team.total_points.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
