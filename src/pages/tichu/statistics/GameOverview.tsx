import { Typography, Grid, Card, CardContent, Box, CircularProgress } from "@mui/material";
import { Trans } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

interface GameOverviewStats {
    totalGames: number;
    totalPlayers: number;
    averageGameScore: number;
    totalTichuCalls: number;
    successfulTichus: number;
    totalGrandTichuCalls: number;
    successfulGrandTichus: number;
    totalBombs: number;
    averageBombsPerGame: number;
    averageTichuCallsPerGame: number;
    averageGrandTichuCallsPerGame: number;
    maxBombsInOneGame: number;
}

export const GameOverview = () => {
    const [stats, setStats] = useState<GameOverviewStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameOverviewStats = async () => {
            try {
                const { data, error } = await supabase.rpc("get_tichu_game_overview_stats");

                if (error) {
                    console.error("Error fetching game overview stats:", error);
                } else if (data && data.length > 0) {
                    const result = data[0];
                    setStats({
                        totalGames: result.total_games,
                        totalPlayers: result.total_players,
                        averageGameScore: result.average_game_score,
                        totalTichuCalls: result.total_tichu_calls,
                        successfulTichus: result.successful_tichus,
                        totalGrandTichuCalls: result.total_grand_tichu_calls,
                        successfulGrandTichus: result.successful_grand_tichus,
                        totalBombs: result.total_bombs,
                        averageBombsPerGame: result.average_bombs_per_game,
                        averageTichuCallsPerGame: result.total_tichu_calls / result.total_games,
                        averageGrandTichuCallsPerGame: result.total_grand_tichu_calls / result.total_games,
                        maxBombsInOneGame: result.max_bombs_in_one_game,
                    });
                }
            } catch (error) {
                console.error("Error fetching game overview stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameOverviewStats();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!stats) {
        return (
            <Box>
                <Typography variant="h5" gutterBottom>
                    <Trans>Game Overview</Trans>
                </Typography>
                <Typography color="text.secondary">
                    <Trans>No data available</Trans>
                </Typography>
            </Box>
        );
    }

    const tichuSuccessRate = ((stats.successfulTichus / stats.totalTichuCalls) * 100).toFixed(1);
    const grandTichuSuccessRate = ((stats.successfulGrandTichus / stats.totalGrandTichuCalls) * 100).toFixed(1);

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="h5">
                    <Trans>Game Overview</Trans>
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card>
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>General Statistics</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Games:</Trans>
                                </Typography>
                                <Typography variant="body1">{stats.totalGames}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Active Players:</Trans>
                                </Typography>
                                <Typography variant="body1">{stats.totalPlayers}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Avg Game Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{stats.averageGameScore}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Tichu Statistics</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {tichuSuccessRate}% ({stats.successfulTichus}/{stats.totalTichuCalls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Grand Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {grandTichuSuccessRate}% ({stats.successfulGrandTichus}/{stats.totalGrandTichuCalls}
                                    )
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>
                                        Tichu called every {(1 / stats.averageTichuCallsPerGame).toFixed(1)} games.
                                    </Trans>
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>
                                        Grand Tichu called every {(1 / stats.averageGrandTichuCallsPerGame).toFixed(1)}{" "}
                                        games.
                                    </Trans>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Bomb Statistics</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Bombs Used:</Trans>
                                </Typography>
                                <Typography variant="body1">{stats.totalBombs}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Avg per Game:</Trans>
                                </Typography>
                                <Typography variant="body1">{stats.averageBombsPerGame}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Max in One Game:</Trans>
                                </Typography>
                                <Typography variant="body1">{stats.maxBombsInOneGame}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
