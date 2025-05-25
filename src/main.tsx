import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewGame from "./pages/NewGame";
import GameResult from "./pages/GameResult";
import { GameProvider } from "./context/GameContext";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameProvider>
            <BrowserRouter basename="/tichu-score-tracker">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/new" element={<NewGame />} />
                    <Route path="/result" element={<GameResult />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />
        </GameProvider>
    </React.StrictMode>,
);
