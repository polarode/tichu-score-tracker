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
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
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

type SortOption = "games" | "name" | "score";

export const PlayerRanking = () => {
    const navigate = useNavigate();
    const [playerStats, setPlayerStats] = useState<PlayerStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("games");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

    const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = (option?: SortOption) => {
        if (option) {
            setSortBy(option);
        }
        setAnchorEl(null);
    };

    const getSortedPlayers = () => {
        const filtered = playerStats.filter((player) => player.games_played > 0);

        switch (sortBy) {
            case "name":
                return filtered.sort((a, b) => a.player_name.localeCompare(b.player_name));
            case "score":
                return filtered.sort((a, b) => b.avg_score - a.avg_score);
            case "games":
            default:
                return filtered.sort((a, b) => b.games_played - a.games_played);
        }
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
                <Button variant="outlined" size="small" startIcon={<SortIcon />} onClick={handleSortClick}>
                    <Trans>Sort by {sortBy === "games" ? "Games" : sortBy === "name" ? "Name" : "Score"}</Trans>
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleSortClose()}>
                    <MenuItem onClick={() => handleSortClose("name")}>
                        <Trans>Name</Trans>
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("games")}>
                        <Trans>Games Played</Trans>
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("score")}>
                        <Trans>Average Score</Trans>
                    </MenuItem>
                </Menu>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Trans>Rank</Trans></TableCell>
                            <TableCell><Trans>Player</Trans></TableCell>
                            <TableCell align="right"><Trans>Games</Trans></TableCell>
                            <TableCell align="right"><Trans>Avg Score</Trans></TableCell>
                            <TableCell align="right"><Trans>Tichu %</Trans></TableCell>
                            <TableCell align="right"><Trans>Grand Tichu %</Trans></TableCell>
                            <TableCell align="right"><Trans>Bombs</Trans></TableCell>
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
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{player.player_name}</TableCell>
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