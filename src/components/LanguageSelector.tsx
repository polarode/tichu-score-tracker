import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";

export function LanguageSelector() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentLanguage, setCurrentLanguage] = useState("DE");

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (language: string) => {
        setCurrentLanguage(language);
        handleClose();
        // Hier würde die Sprachlogik implementiert werden
    };

    return (
        <>
            <Button startIcon={<LanguageIcon />} onClick={handleClick} variant="outlined" size="small">
                {currentLanguage}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleLanguageChange("DE")}>Deutsch</MenuItem>
                <MenuItem onClick={() => handleLanguageChange("EN")}>English</MenuItem>
            </Menu>
        </>
    );
}
