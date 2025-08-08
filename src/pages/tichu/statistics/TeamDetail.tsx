//import { useParams } from "react-router-dom";
import { Typography, Grid, Card, CardContent, Box, Divider, Chip, Alert } from "@mui/material";
import { PageTemplate } from "../../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

// Placeholder data - replace with real data later
const mockTeamDetail = {
    team_id: "1",
    player1_name: "Alice",
    player2_name: "Bob",
    games_played: 15,
    wins: 10,
    losses: 5,
    win_rate: 66.7,
    avg_score: 850,
    total_points: 12750,
    highest_score: 1200,
    lowest_score: 450,
    tichu_calls: 12,
    tichu_success: 8,
    grand_tichu_calls: 3,
    grand_tichu_success: 2,
    bombs_used: 28,
    common_opponents: [
        { team: "Charlie & Diana", games: 6, wins: 4, losses: 2 },
        { team: "Eve & Frank", games: 4, wins: 3, losses: 1 },
    ],
    recent_games: [
        { date: "2024-01-15", score: 920, result: "Win", opponents: "Charlie & Diana" },
        { date: "2024-01-12", score: 780, result: "Loss", opponents: "Eve & Frank" },
        { date: "2024-01-10", score: 1050, result: "Win", opponents: "Charlie & Diana" },
    ],
    performance_trend: "Improving", // Could be "Improving", "Declining", "Stable"
};

const TeamDetail = () => {
    //const { teamId } = useParams<{ teamId: string }>();

    const tichuSuccessRate = ((mockTeamDetail.tichu_success / mockTeamDetail.tichu_calls) * 100).toFixed(1);
    const grandTichuSuccessRate = (
        (mockTeamDetail.grand_tichu_success / mockTeamDetail.grand_tichu_calls) *
        100
    ).toFixed(1);

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Alert severity="info" sx={{ mb: 2 }}>
                <Trans>
                    Team detail statistics are under development. The data shown below is placeholder content.
                </Trans>
            </Alert>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="h4">
                    {mockTeamDetail.player1_name} & {mockTeamDetail.player2_name} - <Trans>Team Statistics</Trans>
                </Typography>
                <Chip label="Placeholder" size="small" color="warning" variant="outlined" />
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Team Performance</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Games Played:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockTeamDetail.games_played}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Win Rate:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {mockTeamDetail.win_rate.toFixed(1)}% ({mockTeamDetail.wins}W -{" "}
                                    {mockTeamDetail.losses}L)
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Average Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockTeamDetail.avg_score}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Points:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockTeamDetail.total_points.toLocaleString()}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Score Analysis</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Highest Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockTeamDetail.highest_score}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Lowest Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockTeamDetail.lowest_score}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Performance Trend:</Trans>
                                </Typography>
                                <Chip
                                    label={mockTeamDetail.performance_trend}
                                    color={
                                        mockTeamDetail.performance_trend === "Improving"
                                            ? "success"
                                            : mockTeamDetail.performance_trend === "Declining"
                                              ? "error"
                                              : "default"
                                    }
                                    size="small"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Tichu Performance</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {tichuSuccessRate}% ({mockTeamDetail.tichu_success}/{mockTeamDetail.tichu_calls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Grand Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {grandTichuSuccessRate}% ({mockTeamDetail.grand_tichu_success}/
                                    {mockTeamDetail.grand_tichu_calls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Bombs Used:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockTeamDetail.bombs_used}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Head-to-Head Records</Trans>
                            </Typography>
                            {mockTeamDetail.common_opponents.map((opponent, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body1" gutterBottom>
                                        vs {opponent.team}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {opponent.wins}W - {opponent.losses}L ({opponent.games} games)
                                    </Typography>
                                    {index < mockTeamDetail.common_opponents.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Recent Games</Trans>
                            </Typography>
                            <Grid container spacing={2}>
                                {mockTeamDetail.recent_games.map((game, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                        <Card variant="outlined">
                                            <CardContent sx={{ pb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2">{game.date}</Typography>
                                                    <Chip
                                                        label={game.result}
                                                        color={game.result === "Win" ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </Box>
                                                <Typography variant="body1" gutterBottom>
                                                    Score: {game.score}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    vs {game.opponents}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageTemplate>
    );
};

export default TeamDetail;
