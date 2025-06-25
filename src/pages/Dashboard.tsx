import { Container, Typography, Card, CardContent, Button, Grid, Box, Tabs, Tab } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import { LastGames } from "./tichu/LastGames";
import { LastMatches } from "./tichu/LastMatches";
import { LastRebelPrincessGames } from "./rebelPrincess/LastGames";
import { Celebration } from "@mui/icons-material";
import { useEffect, useState } from "react";
import changelogData from "../data/changelog.json";
import { Trans } from "@lingui/react/macro";
import { LanguageSelector } from "../components/LanguageSelector";

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
        <Container maxWidth="sm" sx={{p:"8px"}}>
            <LanguageSelector />
            <Button
                onClick={() => navigate("/changelog")}
                variant="outlined"
                size="small"
                sx={{ position: "absolute", top: 20, right: 20 }}
            >
                v{changelogData[0].version}
            </Button>
            <Box sx={{ position: "relative" }}>
                <Typography variant="h4" align="center" sx={{ mt: 8 }} gutterBottom>
                    <Trans>Lets play a game of...</Trans>
                </Typography>
            </Box>

            <Grid container spacing={2}  justifyContent="center">
                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            <Trans>Tichu</Trans>
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<EmojiEventsIcon />}
                                onClick={() => handleStartGame("tichu")}
                            >
                                <Trans>Start Game</Trans>
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/tichu/new-match")}
                            >
                                <Trans>Matches</Trans>
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/tichu/stats")}
                            >
                                <Trans>Statistics</Trans>
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Grid sx={{ xs: 12, sm: 6 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Trans>Rebel Princess</Trans>
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                startIcon={<Celebration />}
                                onClick={() => handleStartGame("rebelPrincess")}
                            >
                                <Trans>Start Game</Trans>
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
                    <Tab label={<Trans>Tichu Games</Trans>} />
                    <Tab label={<Trans>Tichu Matches</Trans>} />
                    <Tab label={<Trans>Rebel Princess</Trans>} />
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
