import { createContext as createRebelPrincessGameContext, useContext, useState } from "react";
import type { Player } from "../lib/types";

interface GameContextType {
    players: Player[];
    setPlayers: (players: Player[]) => void;
}

const GameContext = createRebelPrincessGameContext<GameContextType | undefined>(undefined);

export const RPGameProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);

    return <GameContext.Provider value={{ players, setPlayers }}>{children}</GameContext.Provider>;
};

export const useRebelPrincessGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGameContext must be used within GameProvider");
    return context;
};
