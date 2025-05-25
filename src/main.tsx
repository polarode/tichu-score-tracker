import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewGame from "./pages/NewGame";
import GameResult from "./pages/GameResult";
import { GameProvider } from "./context/GameContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/new" element={<NewGame />} />
                    <Route path="/result" element={<GameResult />} />
                </Routes>
            </BrowserRouter>
        </GameProvider>
    </React.StrictMode>,
);
