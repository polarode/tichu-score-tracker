import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSelector: React.FC = () => {
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
            <IconButton onClick={handleClick} sx={{ position: "absolute", top: 16, left: 16 }} color="primary">
                <LanguageIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleLanguageSelect("en")} selected={language === "en"}>
                    English
                </MenuItem>
                <MenuItem onClick={() => handleLanguageSelect("de")} selected={language === "de"}>
                    Deutsch
                </MenuItem>
            </Menu>
        </>
    );
};
