import { useGameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { useEffect } from "react";

export default function GameResult() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authenticated") === "true";

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;
    const { team1, team2 } = useGameContext();

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                Enter Game Results
            </Typography>
            <div>Team 1: {team1.join(", ")}</div>
            <div>Team 2: {team2.join(", ")}</div>

            {/* You will add form fields here for tichu, scores, etc. */}
        </Container>
    );
}
