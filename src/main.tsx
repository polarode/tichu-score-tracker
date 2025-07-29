import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import NewGame from "./pages/tichu/NewGame";
import NewMatch from "./pages/tichu/NewMatch";
import MatchProgress from "./pages/tichu/MatchProgress";
import RPNewGame from "./pages/rebelPrincess/NewGame";
import RPResult from "./pages/rebelPrincess/RoundResult";
import GameResult from "./pages/tichu/GameResult";
import Statistics from "./pages/tichu/Statistics";
import RPStatistics from "./pages/rebelPrincess/Statistics";
import ChangelogPage from "./pages/Changelog";
import { GameProvider } from "./context/TichuGameContext";
import { RPGameProvider } from "./context/RebelPrincessGameContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastContainer } from "react-toastify";
import { loadCatalog } from "./i18n";

// load initial language, you can detect here a user language with your preferred method
loadCatalog("en");

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <LanguageProvider>
            <GameProvider>
                <RPGameProvider>
                    <BrowserRouter basename="/tichu-score-tracker">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/tichu/new" element={<NewGame />} />
                            <Route path="/tichu/new-match" element={<NewMatch />} />
                            <Route path="/tichu/match-progress" element={<MatchProgress />} />
                            <Route path="/tichu/result" element={<GameResult />} />
                            <Route path="/tichu/stats" element={<Statistics />} />
                            <Route path="/rebel-princess/new" element={<RPNewGame />} />
                            <Route path="/rebel-princess/result" element={<RPResult />} />
                            <Route path="/rebel-princess/stats" element={<RPStatistics />} />
                            <Route path="/changelog" element={<ChangelogPage />} />
                        </Routes>
                    </BrowserRouter>
                </RPGameProvider>
            </GameProvider>
        </LanguageProvider>
        <ToastContainer position="top-right" autoClose={3000} />
    </React.StrictMode>,
);
