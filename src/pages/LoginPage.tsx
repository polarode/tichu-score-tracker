import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

export default function LoginPage() {
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const sharedPassword = import.meta.env.VITE_SHARED_PASSWORD;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === sharedPassword) {
            setError(false);
            localStorage.setItem("authenticated", "true");
            navigate("/dashboard");
        } else {
            setError(true);
        }
    };

    return (
        <Container sx={{ mt: 10 }}>
            <form onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom>
                    Enter Access Password
                </Typography>
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                    }}
                    error={error}
                    helperText={error ? "Incorrect password. Please try again." : ""}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                    Enter
                </Button>
            </form>
        </Container>
    );
}
