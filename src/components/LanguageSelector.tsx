import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../context/LanguageContext";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (lang: "en" | "de") => {
        setLanguage(lang);
        handleClose();
    };

    return (
        <>
            <Button startIcon={<LanguageIcon />} onClick={handleClick} variant="outlined" size="small">
                {language}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleLanguageSelect("de")}>Deutsch</MenuItem>
                <MenuItem onClick={() => handleLanguageSelect("en")}>English</MenuItem>
            </Menu>
        </>
    );
}
