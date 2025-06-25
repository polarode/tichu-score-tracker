import React, { createContext, useContext, useState, useEffect } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { loadCatalog } from "../i18n";

type Language = "en" | "de";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem("language");
        return (saved as Language) || "en";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    useEffect(() => {
        loadCatalog(language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </LanguageContext.Provider>
    );
};
