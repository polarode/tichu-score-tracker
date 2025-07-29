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

interface RPPlayerStatistics {
    player_id: string;
    player_name: string;
    games_played: number;
    rounds_played: number;
    avg_points_per_round: number;
    games_won: number;
    win_rate: number;
}

type SortOption = "games" | "name" | "winrate";

export const Statistics = () => {
    const [playerStats, setPlayerStats] = useState<RPPlayerStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("games");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const fetchPlayerStatistics = async () => {
            const { data, error } = await supabase.rpc("get_rp_player_statistics");

            if (!error && data) {
                setPlayerStats(data as RPPlayerStatistics[]);
            } else if (error) {
                console.error("Error fetching RP player statistics:", error);
            }
            setLoading(false);
        };

        fetchPlayerStatistics();
    }, []);

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
            case "winrate":
                return filtered.sort((a, b) => b.win_rate - a.win_rate);
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
                <Trans>Rebel Princess Statistics</Trans>
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2 }}>
                <Typography variant="h6">
                    <Trans>Player Summary</Trans>
                </Typography>
                <Box>
                    <Button variant="outlined" size="small" startIcon={<SortIcon />} onClick={handleSortClick}>
                        <Trans>Sort by {sortBy === "games" ? "Games" : sortBy === "name" ? "Name" : "Win Rate"}</Trans>
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleSortClose()}>
                        <MenuItem onClick={() => handleSortClose("name")}>
                            <Trans>Name</Trans>
                        </MenuItem>
                        <MenuItem onClick={() => handleSortClose("games")}>
                            <Trans>Games Played</Trans>
                        </MenuItem>
                        <MenuItem onClick={() => handleSortClose("winrate")}>
                            <Trans>Win Rate</Trans>
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
                                        <Trans>Rounds:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{player.rounds_played}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Avg Points/Round:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{player.avg_points_per_round}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Games Won:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{player.games_won}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <Trans>Win Rate:</Trans>
                                    </Typography>
                                    <Typography variant="body1">{player.win_rate}%</Typography>
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