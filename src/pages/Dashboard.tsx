import { Container, Typography, Card, CardContent, Button, Grid, Box } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import { LastGames } from "./tichu/LastGames";
import { Celebration } from "@mui/icons-material";

export default function DashboardPage() {
    const navigate = useNavigate();
    const handleStartGame = (gameType: string) => {
        if (gameType === "tichu") {
            navigate("/tichu/new");
        } else if (gameType === "rebelPrincess") {
            navigate("/rebel-princess/new");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Lets play a game of...
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                <Grid sx={{ xs: 12, sm: 6 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tichu
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<EmojiEventsIcon />}
                                onClick={() => handleStartGame("tichu")}
                            >
                                Start Game
                            </Button>
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
                <LastGames />
            </Box>
        </Container>
    );
}
