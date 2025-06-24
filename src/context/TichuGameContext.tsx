import { createContext as createTichuContext, useContext, useState } from "react";
import type { Player, MatchSeries, MatchStandings } from "../lib/types";

interface GameContextType {
    team1: Player[];
    team2: Player[];
    currentMatch: MatchSeries | null;
    matchStandings: MatchStandings | null;
    setTeams: (t1: Player[], t2: Player[]) => void;
    setCurrentMatch: (match: MatchSeries | null) => void;
    setMatchStandings: (standings: MatchStandings | null) => void;
}

const GameContext = createTichuContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [team1, setTeam1] = useState<Player[]>([]);
    const [team2, setTeam2] = useState<Player[]>([]);
    const [currentMatch, setCurrentMatch] = useState<MatchSeries | null>(null);
    const [matchStandings, setMatchStandings] = useState<MatchStandings | null>(null);

    const setTeams = (t1: Player[], t2: Player[]) => {
        setTeam1(t1);
        setTeam2(t2);
    };

    return (
        <GameContext.Provider 
            value={{ 
                team1, 
                team2, 
                currentMatch, 
                matchStandings, 
                setTeams, 
                setCurrentMatch, 
                setMatchStandings 
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useTichuGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGameContext must be used within GameProvider");
    return context;
};
