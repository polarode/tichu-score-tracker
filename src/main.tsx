import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import NewGame from "./pages/tichu/NewGame";
import RPNewGame from "./pages/rebelPrincess/NewGame";
import RPResult from "./pages/rebelPrincess/RoundResult";
import GameResult from "./pages/tichu/GameResult";
import { GameProvider } from "./context/TichuGameContext";
import { RPGameProvider } from "./context/RebelPrincessGameContext";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameProvider>
            <RPGameProvider>
                <BrowserRouter basename="/tichu-score-tracker">
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/tichu/new" element={<NewGame />} />
                            <Route path="/tichu/result" element={<GameResult />} />
                            <Route path="/rebel-princess/new" element={<RPNewGame />} />
                            <Route path="/rebel-princess/result" element={<RPResult />} />
                    </Routes>
                </BrowserRouter>
            </RPGameProvider>
        </GameProvider>
        <ToastContainer position="top-right" autoClose={3000} />
    </React.StrictMode>,
);
