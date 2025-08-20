import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
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
} from "@mui/material";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";

interface PlayerStatistics {
    player_id: string;
    player_name: string;
    games_played: number;
    avg_score: number;
    tichu_calls: number;
    tichu_success: number;
    grand_tichu_calls: number;
    grand_tichu_success: number;
    bombs_used: number;
}

type SortOption = "games" | "name" | "score" | "tichu" | "grandTichu" | "bombs";
type SortOrder = "asc" | "desc";

export const PlayerRanking = () => {
    const navigate = useNavigate();
    const [playerStats, setPlayerStats] = useState<PlayerStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("games");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    useEffect(() => {
        const fetchPlayerStatistics = async () => {
            const { data, error } = await supabase.rpc("get_player_statistics");

            if (!error && data) {
                setPlayerStats(data as PlayerStatistics[]);
            } else if (error) {
                console.error("Error fetching player statistics:", error);
            }
            setLoading(false);
        };

        fetchPlayerStatistics();
    }, []);

    const calculateSuccessRate = (success: number, total: number): string => {
        if (total === 0) return "0%";
        return `${Math.round((success / total) * 100)}%`;
    };

    const handleSort = (column: SortOption) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    const getSortedPlayers = () => {
        const filtered = playerStats.filter((player) => player.games_played > 0);
        const multiplier = sortOrder === "asc" ? 1 : -1;

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return multiplier * a.player_name.localeCompare(b.player_name);
                case "score":
                    return multiplier * (a.avg_score - b.avg_score);
                case "tichu":
                    const aTichuRate = a.tichu_calls > 0 ? a.tichu_success / a.tichu_calls : 0;
                    const bTichuRate = b.tichu_calls > 0 ? b.tichu_success / b.tichu_calls : 0;
                    return multiplier * (aTichuRate - bTichuRate);
                case "grandTichu":
                    const aGrandRate = a.grand_tichu_calls > 0 ? a.grand_tichu_success / a.grand_tichu_calls : 0;
                    const bGrandRate = b.grand_tichu_calls > 0 ? b.grand_tichu_success / b.grand_tichu_calls : 0;
                    return multiplier * (aGrandRate - bGrandRate);
                case "bombs":
                    return multiplier * (a.bombs_used - b.bombs_used);
                case "games":
                default:
                    return multiplier * (a.games_played - b.games_played);
            }
        });
    };

    const handlePlayerClick = (playerId: string) => {
        navigate(`/tichu/stats/player/${playerId}`);
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">
                    <Trans>Player Rankings</Trans>
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <Table sx={{ minWidth: 700, "& .MuiTableCell-root": { px: 1, py: 1 } }}>
                    <TableHead sx={{ position: "sticky", top: 0, zIndex: 2 }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    width: 60,
                                    position: "sticky",
                                    left: 0,
                                    backgroundColor: "background.paper",
                                    zIndex: 3,
                                    borderRight: "none",
                                }}
                            >
                                #
                            </TableCell>
                            <TableCell
                                sx={{
                                    position: "sticky",
                                    left: 60,
                                    backgroundColor: "background.paper",
                                    zIndex: 3,
                                    borderLeft: "none",
                                }}
                            >
                                <TableSortLabel
                                    active={sortBy === "name"}
                                    direction={sortBy === "name" ? sortOrder : "desc"}
                                    onClick={() => handleSort("name")}
                                >
                                    <Trans>Player</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ backgroundColor: "background.paper" }}>
                                <TableSortLabel
                                    active={sortBy === "games"}
                                    direction={sortBy === "games" ? sortOrder : "desc"}
                                    onClick={() => handleSort("games")}
                                >
                                    <Trans>Games</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ backgroundColor: "background.paper" }}>
                                <TableSortLabel
                                    active={sortBy === "score"}
                                    direction={sortBy === "score" ? sortOrder : "desc"}
                                    onClick={() => handleSort("score")}
                                >
                                    <Trans>Avg Score</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ backgroundColor: "background.paper" }}>
                                <TableSortLabel
                                    active={sortBy === "tichu"}
                                    direction={sortBy === "tichu" ? sortOrder : "desc"}
                                    onClick={() => handleSort("tichu")}
                                >
                                    <Trans>Tichu %</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ backgroundColor: "background.paper" }}>
                                <TableSortLabel
                                    active={sortBy === "grandTichu"}
                                    direction={sortBy === "grandTichu" ? sortOrder : "desc"}
                                    onClick={() => handleSort("grandTichu")}
                                >
                                    <Trans>Grand Tichu %</Trans>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ backgroundColor: "background.paper" }}>
                                <TableSortLabel
                                    active={sortBy === "bombs"}
                                    direction={sortBy === "bombs" ? sortOrder : "desc"}
                                    onClick={() => handleSort("bombs")}
                                >
                                    <Trans>Bombs</Trans>
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getSortedPlayers().map((player, index) => (
                            <TableRow
                                key={player.player_id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => handlePlayerClick(player.player_id)}
                            >
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        left: 0,
                                        backgroundColor: "background.paper",
                                        zIndex: 1,
                                        borderRight: "none",
                                    }}
                                >
                                    {index + 1}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        left: 60,
                                        backgroundColor: "background.paper",
                                        zIndex: 1,
                                        borderLeft: "none",
                                    }}
                                >
                                    {player.player_name}
                                </TableCell>
                                <TableCell align="right">{player.games_played}</TableCell>
                                <TableCell align="right">{Math.round(player.avg_score)}</TableCell>
                                <TableCell align="right">
                                    {calculateSuccessRate(player.tichu_success, player.tichu_calls)}
                                </TableCell>
                                <TableCell align="right">
                                    {calculateSuccessRate(player.grand_tichu_success, player.grand_tichu_calls)}
                                </TableCell>
                                <TableCell align="right">{player.bombs_used}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
