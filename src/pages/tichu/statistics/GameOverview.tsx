import {
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
} from "@mui/material";
import { Trans } from "@lingui/react/macro";

// Placeholder data - replace with real data later
const gameOverviewStats = {
    totalGames: 47,
    totalPlayers: 8,
    averageGameScore: 1650,
    mostCommonWinningScore: 1000,
    highestScore: 2340,
    lowestScore: -450,
    totalTichuCalls: 89,
    successfulTichus: 52,
    totalGrandTichuCalls: 23,
    successfulGrandTichus: 14,
    totalBombs: 156,
    averageBombsPerGame: 3.3,
};

export const GameOverview = () => {
    const tichuSuccessRate = ((gameOverviewStats.successfulTichus / gameOverviewStats.totalTichuCalls) * 100).toFixed(1);
    const grandTichuSuccessRate = ((gameOverviewStats.successfulGrandTichus / gameOverviewStats.totalGrandTichuCalls) * 100).toFixed(1);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                <Trans>Game Overview</Trans>
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>General Statistics</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Games:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.totalGames}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Active Players:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.totalPlayers}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Avg Game Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.averageGameScore}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Score Statistics</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Highest Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.highestScore}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Lowest Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.lowestScore}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Common Win Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.mostCommonWinningScore}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
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
                                    {tichuSuccessRate}% ({gameOverviewStats.successfulTichus}/{gameOverviewStats.totalTichuCalls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Grand Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {grandTichuSuccessRate}% ({gameOverviewStats.successfulGrandTichus}/{gameOverviewStats.totalGrandTichuCalls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Bombs:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.totalBombs}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Bomb Statistics</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Bombs Used:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.totalBombs}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Avg per Game:</Trans>
                                </Typography>
                                <Typography variant="body1">{gameOverviewStats.averageBombsPerGame}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};