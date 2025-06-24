import { Container, Typography, Card, CardContent, Button, Grid, Box, Tabs, Tab } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import { LastGames } from "./tichu/LastGames";
import { LastMatches } from "./tichu/LastMatches";
import { LastRebelPrincessGames } from "./rebelPrincess/LastGames";
import { Celebration } from "@mui/icons-material";
import { useEffect, useState } from "react";
import changelogData from "../data/changelog.json";

export default function DashboardPage() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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
        <Container maxWidth="sm">
            <Button
                onClick={() => navigate("/changelog")}
                variant="outlined"
                size="small"
                sx={{ position: "absolute", top: 16, right: 16 }}
            >
                v{changelogData[0].version}
            </Button>
            <Box sx={{ position: "relative" }}>
                <Typography variant="h4" align="center" sx={{ mt: 8 }} gutterBottom>
                    Lets play a game of...
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                <Grid sx={{ xs: 12, sm: 6 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tichu
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EmojiEventsIcon />}
                                    onClick={() => handleStartGame("tichu")}
                                >
                                    Start Game
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate("/tichu/new-match")}
                                >
                                    Start Match
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate("/tichu/stats")}
                                >
                                    View Statistics
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid sx={{ xs: 12, sm: 6 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Rebel Princess
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                startIcon={<Celebration />}
                                onClick={() => handleStartGame("rebelPrincess")}
                            >
                                Start Game
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
                    <Tab label="Tichu Games" />
                    <Tab label="Tichu Matches" />
                    <Tab label="Rebel Princess" />
                </Tabs>
                <Box sx={{ display: tabValue === 0 ? "block" : "none" }}>
                    <LastGames />
                </Box>
                <Box sx={{ display: tabValue === 1 ? "block" : "none" }}>
                    <LastMatches />
                </Box>
                <Box sx={{ display: tabValue === 2 ? "block" : "none" }}>
                    <LastRebelPrincessGames />
                </Box>
            </Box>
        </Container>
    );
}
