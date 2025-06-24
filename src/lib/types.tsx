export type Player = {
    id: string;
    name: string;
};

export type RPRoundModifier = {
    id: string;
    name: string;
};

export type MatchSeries = {
    id: string;
    created_at: string;
    target_points: number;
    status: 'active' | 'completed';
    winning_team: number | null;
};

export type MatchStandings = {
    team: number;
    total_score: number;
    game_count: number;
}[];
