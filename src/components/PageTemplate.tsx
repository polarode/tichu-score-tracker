import { Box, Button, Container, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import changelogData from "../data/changelog.json";
import HomeIcon from "@mui/icons-material/Home";
import { CatPaws } from "react-cat-paws";
import { useState } from "react";

interface PageTemplateProps {
    children: React.ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    showVersionButton?: boolean;
    showHomeButton?: boolean;
}

export function PageTemplate({
    children,
    maxWidth = "sm",
    showVersionButton = true,
    showHomeButton = true,
}: PageTemplateProps) {
    const navigate = useNavigate();
    const [showCatPaws, setShowCatPaws] = useState(false);

    return (
        <Box>
            <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 1000 }}>
                <LanguageSelector />
            </Box>
            {showHomeButton && (
                <Button
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/")}
                    sx={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}
                />
            )}
            {showVersionButton && (
                <Button
                    onClick={() => navigate("/changelog")}
                    variant="outlined"
                    size="small"
                    sx={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
                >
                    v{changelogData[0].version}
                </Button>
            )}

            <Container maxWidth={maxWidth} sx={{ p: "8px", position: "relative" }}>
                <Box sx={{ mt: 8 }}>{children}</Box>
            </Container>

            <IconButton
                onClick={() => setShowCatPaws(true)}
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    fontSize: "0.8rem",
                    padding: "4px",
                    zIndex: 1000,
                }}
            >
                🐱
            </IconButton>
            {showCatPaws && <CatPaws onClose={() => setShowCatPaws(false)} fillScreen />}
        </Box>
    );
}
