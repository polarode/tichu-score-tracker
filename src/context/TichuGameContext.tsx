import { createContext as createTichuContext, useContext, useState } from "react";
import type { Player } from "../lib/types";

interface GameContextType {
    team1: Player[];
    team2: Player[];
    setTeams: (t1: Player[], t2: Player[]) => void;
}

const GameContext = createTichuContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [team1, setTeam1] = useState<Player[]>([]);
    const [team2, setTeam2] = useState<Player[]>([]);

    const setTeams = (t1: Player[], t2: Player[]) => {
        setTeam1(t1);
        setTeam2(t2);
    };

    return <GameContext.Provider value={{ team1, team2, setTeams }}>{children}</GameContext.Provider>;
};

export const useTichuGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGameContext must be used within GameProvider");
    return context;
};
