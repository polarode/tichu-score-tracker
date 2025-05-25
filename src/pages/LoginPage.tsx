import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

export default function LoginPage() {
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();

    const sharedPassword = import.meta.env.VITE_SHARED_PASSWORD;

    const handleLogin = () => {
        if (password === sharedPassword) {
            localStorage.setItem("authenticated", "true");
            navigate("/new");
        }
    };

    return (
        <Container sx={{ mt: 10 }}>
            <Typography variant="h5" gutterBottom>
                Enter Access Password
            </Typography>
            <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth onClick={handleLogin}>
                Enter
            </Button>
        </Container>
    );
}
