import { Typography, Card, CardContent, Button, Box, Stack, Collapse, Divider, Tabs, Tab } from "@mui/material";
import { PlayArrow, BarChart, EmojiEvents, Celebration, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LastGames } from "./tichu/LastGames";
import { LastMatches } from "./tichu/LastMatches";
import { LastRebelPrincessGames } from "./rebelPrincess/LastGames";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/react/macro";
import { PageTemplate } from "../components/PageTemplate";

export default function DashboardPage() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const [tichuExpanded, setTichuExpanded] = useState(false);
    const [rebelExpanded, setRebelExpanded] = useState(false);
    const [tichuTabValue, setTichuTabValue] = useState(0);

    const handleCardClick = (gameType: string, event: React.MouseEvent) => {
        if ((event.target as HTMLElement).closest("button")) return;

        if (gameType === "tichu") {
            setTichuExpanded(!tichuExpanded);
            setRebelExpanded(false);
        } else {
            setRebelExpanded(!rebelExpanded);
            setTichuExpanded(false);
        }
    };

    const handleTichuTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTichuTabValue(newValue);
    };

    const handleStartGame = (gameType: string) => {
        if (gameType === "tichu") {
            navigate("/tichu/new");
        } else if (gameType === "rebelPrincess") {
            navigate("/rebel-princess/new");
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <PageTemplate showHomeButton={false}>
            <Box sx={{ px: 2, pb: 2, pt: 2 }}>
                <Stack spacing={4}>
                    {/* Tichu Section */}
                    <Card
                        onClick={(e) => handleCardClick("tichu", e)}
                        sx={{
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                            border: "none",
                            boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 30px rgba(25, 118, 210, 0.25)",
                            },
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <EmojiEvents sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.dark" }}>
                                        <Trans>Tichu</Trans>
                                    </Typography>
                                </Box>
                                <ExpandMore
                                    sx={{
                                        color: "primary.main",
                                        transform: tichuExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease",
                                    }}
                                />
                            </Box>
                            <Stack spacing={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<PlayArrow sx={{ fontSize: 24 }} />}
                                    onClick={() => handleStartGame("tichu")}
                                    sx={{
                                        py: 2,
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                                        "&:hover": {
                                            boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    <Trans>Start Game</Trans>
                                </Button>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        onClick={() => navigate("/tichu/new-match")}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            borderColor: "primary.main",
                                            "&:hover": {
                                                backgroundColor: "primary.50",
                                            },
                                        }}
                                    >
                                        <Trans>Matches</Trans>
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<BarChart />}
                                        onClick={() => navigate("/tichu/stats")}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            borderColor: "primary.main",
                                            "&:hover": {
                                                backgroundColor: "primary.50",
                                            },
                                        }}
                                    >
                                        <Trans>Stats</Trans>
                                    </Button>
                                </Box>
                            </Stack>

                            <Collapse in={tichuExpanded}>
                                <Divider sx={{ my: 3, borderColor: "primary.light" }} />
                                <Tabs
                                    value={tichuTabValue}
                                    onChange={handleTichuTabChange}
                                    variant="fullWidth"
                                    sx={{ mb: 2 }}
                                >
                                    <Tab label={<Trans>Games</Trans>} />
                                    <Tab label={<Trans>Matches</Trans>} />
                                </Tabs>
                                <Box sx={{ display: tichuTabValue === 0 ? "block" : "none" }}>
                                    <LastGames />
                                </Box>
                                <Box sx={{ display: tichuTabValue === 1 ? "block" : "none" }}>
                                    <LastMatches />
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>

                    {/* Rebel Princess Section */}
                    <Card
                        onClick={(e) => handleCardClick("rebel", e)}
                        sx={{
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)",
                            border: "none",
                            boxShadow: "0 4px 20px rgba(156, 39, 176, 0.15)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 30px rgba(156, 39, 176, 0.25)",
                            },
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Celebration sx={{ mr: 2, color: "secondary.main", fontSize: 32 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: "secondary.dark" }}>
                                        <Trans>Rebel Princess</Trans>
                                    </Typography>
                                </Box>
                                <ExpandMore
                                    sx={{
                                        color: "secondary.main",
                                        transform: rebelExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease",
                                    }}
                                />
                            </Box>
                            <Stack spacing={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    startIcon={<PlayArrow sx={{ fontSize: 24 }} />}
                                    onClick={() => handleStartGame("rebelPrincess")}
                                    sx={{
                                        py: 2,
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        boxShadow: "0 4px 15px rgba(156, 39, 176, 0.3)",
                                        "&:hover": {
                                            boxShadow: "0 6px 20px rgba(156, 39, 176, 0.4)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    <Trans>Start Game</Trans>
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="medium"
                                    startIcon={<BarChart />}
                                    onClick={() => navigate("/rebel-princess/stats")}
                                    sx={{
                                        borderRadius: 2,
                                        "&:hover": {
                                            backgroundColor: "secondary.50",
                                        },
                                    }}
                                >
                                    <Trans>Statistics</Trans>
                                </Button>
                            </Stack>

                            <Collapse in={rebelExpanded}>
                                <Divider sx={{ my: 3, borderColor: "secondary.light" }} />
                                <Typography variant="h6" sx={{ mb: 2, color: "secondary.dark", fontWeight: 500 }}>
                                    <Trans>Recent Games</Trans>
                                </Typography>
                                <LastRebelPrincessGames />
                            </Collapse>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </PageTemplate>
    );
}
