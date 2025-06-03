import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NewGame from "./pages/tichu/NewGame";
import GameResult from "./pages/tichu/GameResult";
import { GameProvider } from "./context/GameContext";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameProvider>
            <BrowserRouter basename="/tichu-score-tracker">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tichu/new" element={<NewGame />} />
                    <Route path="/tichu/result" element={<GameResult />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />
        </GameProvider>
    </React.StrictMode>,
);
