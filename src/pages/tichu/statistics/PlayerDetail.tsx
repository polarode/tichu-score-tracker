import { useParams } from "react-router-dom";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Divider,
    Chip,
    Alert,
} from "@mui/material";
import { PageTemplate } from "../../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";

// Placeholder data - replace with real data later
const mockPlayerDetail = {
    player_id: "1",
    player_name: "Alice",
    games_played: 25,
    wins: 15,
    losses: 10,
    win_rate: 60,
    avg_score: 875,
    total_points: 21875,
    tichu_calls: 18,
    tichu_success: 12,
    grand_tichu_calls: 5,
    grand_tichu_success: 3,
    bombs_used: 34,
    favorite_partners: ["Bob", "Charlie"],
    best_partnership: { partner: "Bob", win_rate: 75, games: 12 },
    recent_games: [
        { date: "2024-01-15", score: 920, result: "Win", partner: "Bob" },
        { date: "2024-01-12", score: 780, result: "Loss", partner: "Charlie" },
        { date: "2024-01-10", score: 1050, result: "Win", partner: "Bob" },
    ],
};

const PlayerDetail = () => {
    const { playerId } = useParams<{ playerId: string }>();

    const tichuSuccessRate = ((mockPlayerDetail.tichu_success / mockPlayerDetail.tichu_calls) * 100).toFixed(1);
    const grandTichuSuccessRate = ((mockPlayerDetail.grand_tichu_success / mockPlayerDetail.grand_tichu_calls) * 100).toFixed(1);

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Alert severity="info" sx={{ mb: 2 }}>
                <Trans>Player detail statistics are under development. The data shown below is placeholder content.</Trans>
            </Alert>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="h4">
                    {mockPlayerDetail.player_name} - <Trans>Player Statistics</Trans>
                </Typography>
                <Chip label="Placeholder" size="small" color="warning" variant="outlined" />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Performance Overview</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Games Played:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockPlayerDetail.games_played}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Win Rate:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {mockPlayerDetail.win_rate}% ({mockPlayerDetail.wins}W - {mockPlayerDetail.losses}L)
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Average Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockPlayerDetail.avg_score}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Points:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockPlayerDetail.total_points.toLocaleString()}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
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
                                    {tichuSuccessRate}% ({mockPlayerDetail.tichu_success}/{mockPlayerDetail.tichu_calls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Grand Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {grandTichuSuccessRate}% ({mockPlayerDetail.grand_tichu_success}/{mockPlayerDetail.grand_tichu_calls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Bombs Used:</Trans>
                                </Typography>
                                <Typography variant="body1">{mockPlayerDetail.bombs_used}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Partnership Analysis</Trans>
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <Trans>Best Partnership:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {mockPlayerDetail.best_partnership.partner} - {mockPlayerDetail.best_partnership.win_rate}% 
                                    ({mockPlayerDetail.best_partnership.games} games)
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <Trans>Frequent Partners:</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {mockPlayerDetail.favorite_partners.map((partner) => (
                                    <Chip key={partner} label={partner} size="small" />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Recent Games</Trans>
                            </Typography>
                            {mockPlayerDetail.recent_games.map((game, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="body2">{game.date}</Typography>
                                        <Chip 
                                            label={game.result} 
                                            color={game.result === "Win" ? "success" : "error"} 
                                            size="small" 
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Score: {game.score} | Partner: {game.partner}
                                    </Typography>
                                    {index < mockPlayerDetail.recent_games.length - 1 && <Divider sx={{ mt: 1 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageTemplate>
    );
};

export default PlayerDetail;