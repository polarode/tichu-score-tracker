import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Divider,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { PageTemplate } from "../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

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

export const Statistics = () => {
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

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Typography variant="h4" gutterBottom>
                <Trans>Tichu Statistics</Trans>
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2 }}>
                <Typography variant="h6">
                    <Trans>Player Summary</Trans>
                </Typography>
                <Box>
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
            </Box>

            <Grid container spacing={2}>
                {getSortedPlayers().map((player) => (
                    <Grid size={12} key={player.player_id}>
                        <Card variant="outlined" sx={{ width: "100%", maxWidth: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {player.player_name}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Games:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{player.games_played}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Avg Score:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{Math.round(player.avg_score)}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Tichus won:</Trans>
                                    </Typography>
                                    <Typography variant="body1">
                                        {calculateSuccessRate(player.tichu_success, player.tichu_calls)}
                                        <Typography variant="caption" color="text.secondary" component="span">
                                            {` (${player.tichu_success}/${player.tichu_calls})`}
                                        </Typography>
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Grand Tichus won:</Trans>
                                    </Typography>
                                    <Typography variant="body1">
                                        {calculateSuccessRate(player.grand_tichu_success, player.grand_tichu_calls)}
                                        <Typography variant="caption" color="text.secondary" component="span">
                                            {` (${player.grand_tichu_success}/${player.grand_tichu_calls})`}
                                        </Typography>
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Bombs Used:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{player.bombs_used}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </PageTemplate>
    );
};

export default Statistics;
