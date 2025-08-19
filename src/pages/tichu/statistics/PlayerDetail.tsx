import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Box, Divider, Chip, CircularProgress, Link } from "@mui/material";
import { PageTemplate } from "../../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";
import { supabase } from "../../../lib/supabase";

type PlayerDetailStatistics = {
    player_id: string;
    player_name: string;
    games_played: number;
    wins: number;
    losses: number;
    win_rate: number;
    avg_score: number;
    total_points: number;
    tichu_calls: number;
    tichu_success: number;
    grand_tichu_calls: number;
    grand_tichu_success: number;
    bombs_used: number;
};

type PlayerRecentGame = {
    game_date: string;
    own_score: number;
    opponent_score: number;
    result: "Win" | "Loss" | "Draw";
    partner_name: string;
    opponent_names: string;
};

type PlayerPartnership = {
    partner_id: string;
    partner_name: string;
    games_together: number;
    wins_together: number;
    win_rate: number;
};

const PlayerDetail = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const navigate = useNavigate();
    const [playerStats, setPlayerStats] = useState<PlayerDetailStatistics | null>(null);
    const [recentGames, setRecentGames] = useState<PlayerRecentGame[]>([]);
    const [partnerships, setPartnerships] = useState<PlayerPartnership[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerData = async () => {
            if (!playerId) return;

            const [statsResult, recentResult, partnersResult] = await Promise.all([
                supabase.rpc("get_player_detail_statistics", { target_player_id: playerId }),
                supabase.rpc("get_player_recent_games", { target_player_id: playerId, game_limit: 5 }),
                supabase.rpc("get_player_partnerships", { target_player_id: playerId }),
            ]);

            if (statsResult.data?.[0]) setPlayerStats(statsResult.data[0]);
            if (recentResult.data) {
                console.log("Recent games data:", recentResult.data);
                setRecentGames(recentResult.data);
            }
            if (partnersResult.data) setPartnerships(partnersResult.data);

            setLoading(false);
        };

        fetchPlayerData();
    }, [playerId]);

    if (loading) {
        return (
            <PageTemplate maxWidth="lg" showVersionButton={false}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </PageTemplate>
        );
    }

    if (!playerStats) {
        return (
            <PageTemplate maxWidth="lg" showVersionButton={false}>
                <Typography variant="h6">Player not found</Typography>
            </PageTemplate>
        );
    }

    const tichuSuccessRate =
        playerStats.tichu_calls > 0 ? ((playerStats.tichu_success / playerStats.tichu_calls) * 100).toFixed(1) : "0.0";
    const grandTichuSuccessRate =
        playerStats.grand_tichu_calls > 0
            ? ((playerStats.grand_tichu_success / playerStats.grand_tichu_calls) * 100).toFixed(1)
            : "0.0";

    // Find best partnership with tiered approach - highest win rate within each tier
    const partnerships10Plus = partnerships
        .filter((p) => p.games_together >= 10)
        .sort((a, b) => b.win_rate - a.win_rate);

    const partnerships5Plus = partnerships
        .filter((p) => p.games_together >= 5 && p.games_together < 10)
        .sort((a, b) => b.win_rate - a.win_rate);

    const bestPartnership = partnerships10Plus[0] || partnerships5Plus[0];

    const frequentPartners = partnerships.slice(0, 5);

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="h4">
                    {playerStats.player_name} - <Trans>Player Statistics</Trans>
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Performance Overview</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Games Played:</Trans>
                                </Typography>
                                <Typography variant="body1">{playerStats.games_played}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Win Rate:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {playerStats.win_rate.toFixed(1)}% ({playerStats.wins}W - {playerStats.losses}L)
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Average Score:</Trans>
                                </Typography>
                                <Typography variant="body1">{Math.round(playerStats.avg_score)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Total Points:</Trans>
                                </Typography>
                                <Typography variant="body1">{playerStats.total_points.toLocaleString()}</Typography>
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
                                    {tichuSuccessRate}% ({playerStats.tichu_success}/{playerStats.tichu_calls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Grand Tichu Success:</Trans>
                                </Typography>
                                <Typography variant="body1">
                                    {grandTichuSuccessRate}% ({playerStats.grand_tichu_success}/
                                    {playerStats.grand_tichu_calls})
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>Bombs Used:</Trans>
                                </Typography>
                                <Typography variant="body1">{playerStats.bombs_used}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Partnership Analysis</Trans>
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <Trans>Best Partnership:</Trans>
                                </Typography>
                                {bestPartnership ? (
                                    <Typography variant="body1">
                                        <Link
                                            component="button"
                                            variant="inherit"
                                            onClick={() =>
                                                navigate(`/tichu/stats/player/${bestPartnership.partner_id}`)
                                            }
                                            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                        >
                                            {bestPartnership.partner_name}
                                        </Link>{" "}
                                        - {bestPartnership.win_rate.toFixed(1)}% ({bestPartnership.games_together}{" "}
                                        games)
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        <Trans>No partnerships with 5+ games</Trans>
                                    </Typography>
                                )}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <Trans>Frequent Partners:</Trans>
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {frequentPartners.map((partner) => (
                                    <Chip
                                        key={partner.partner_id}
                                        label={`${partner.partner_name} (${partner.games_together})`}
                                        size="small"
                                        onClick={() => navigate(`/tichu/stats/player/${partner.partner_id}`)}
                                        sx={{ cursor: "pointer" }}
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                <Trans>Recent Games</Trans>
                            </Typography>
                            {recentGames.length > 0 ? (
                                recentGames.map((game, index) => (
                                    <Box
                                        key={index}
                                        sx={{ mb: 1, p: 1.5, border: 1, borderColor: "divider", borderRadius: 1 }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(game.game_date).toLocaleDateString()}
                                            </Typography>
                                            <Chip
                                                label={game.result || "Unknown"}
                                                color={
                                                    game.result === "Win"
                                                        ? "success"
                                                        : game.result === "Loss"
                                                          ? "error"
                                                          : "default"
                                                }
                                                size="small"
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color={
                                                    game.result === "Win"
                                                        ? "success.main"
                                                        : game.result === "Loss"
                                                          ? "error.main"
                                                          : "text.primary"
                                                }
                                            >
                                                {game.own_score}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mx: 1 }}>
                                                :
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color={
                                                    game.result === "Loss"
                                                        ? "success.main"
                                                        : game.result === "Win"
                                                          ? "error.main"
                                                          : "text.primary"
                                                }
                                            >
                                                {game.opponent_score}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">
                                                {game.partner_name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                <Trans>vs</Trans> {game.opponent_names}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    <Trans>No games played yet</Trans>
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageTemplate>
    );
};

export default PlayerDetail;
