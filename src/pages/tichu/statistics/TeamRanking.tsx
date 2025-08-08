import { useState } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";

interface TeamStatistics {
    team_id: string;
    player1_name: string;
    player2_name: string;
    games_played: number;
    wins: number;
    losses: number;
    win_rate: number;
    avg_score: number;
    total_points: number;
}

type SortOption = "wins" | "winRate" | "games" | "avgScore";

// Placeholder data - replace with real data later
const mockTeamStats: TeamStatistics[] = [
    {
        team_id: "1",
        player1_name: "Alice",
        player2_name: "Bob",
        games_played: 15,
        wins: 10,
        losses: 5,
        win_rate: 66.7,
        avg_score: 850,
        total_points: 12750,
    },
    {
        team_id: "2",
        player1_name: "Charlie",
        player2_name: "Diana",
        games_played: 12,
        wins: 8,
        losses: 4,
        win_rate: 66.7,
        avg_score: 820,
        total_points: 9840,
    },
    {
        team_id: "3",
        player1_name: "Eve",
        player2_name: "Frank",
        games_played: 8,
        wins: 3,
        losses: 5,
        win_rate: 37.5,
        avg_score: 720,
        total_points: 5760,
    },
];

export const TeamRanking = () => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortOption>("wins");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = (option?: SortOption) => {
        if (option) {
            setSortBy(option);
        }
        setAnchorEl(null);
    };

    const getSortedTeams = () => {
        switch (sortBy) {
            case "winRate":
                return [...mockTeamStats].sort((a, b) => b.win_rate - a.win_rate);
            case "games":
                return [...mockTeamStats].sort((a, b) => b.games_played - a.games_played);
            case "avgScore":
                return [...mockTeamStats].sort((a, b) => b.avg_score - a.avg_score);
            case "wins":
            default:
                return [...mockTeamStats].sort((a, b) => b.wins - a.wins);
        }
    };

    const handleTeamClick = (teamId: string) => {
        navigate(`/tichu/stats/team/${teamId}`);
    };

    const getSortLabel = () => {
        switch (sortBy) {
            case "winRate": return "Win Rate";
            case "games": return "Games";
            case "avgScore": return "Avg Score";
            case "wins": return "Wins";
            default: return "Wins";
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">
                    <Trans>Team Rankings</Trans>
                </Typography>
                <Button variant="outlined" size="small" startIcon={<SortIcon />} onClick={handleSortClick}>
                    <Trans>Sort by {getSortLabel()}</Trans>
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleSortClose()}>
                    <MenuItem onClick={() => handleSortClose("wins")}>
                        <Trans>Wins</Trans>
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("winRate")}>
                        <Trans>Win Rate</Trans>
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("games")}>
                        <Trans>Games Played</Trans>
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("avgScore")}>
                        <Trans>Average Score</Trans>
                    </MenuItem>
                </Menu>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Trans>Rank</Trans></TableCell>
                            <TableCell><Trans>Team</Trans></TableCell>
                            <TableCell align="right"><Trans>Games</Trans></TableCell>
                            <TableCell align="right"><Trans>Wins</Trans></TableCell>
                            <TableCell align="right"><Trans>Losses</Trans></TableCell>
                            <TableCell align="right"><Trans>Win Rate</Trans></TableCell>
                            <TableCell align="right"><Trans>Avg Score</Trans></TableCell>
                            <TableCell align="right"><Trans>Total Points</Trans></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getSortedTeams().map((team, index) => (
                            <TableRow 
                                key={team.team_id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleTeamClick(team.team_id)}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{team.player1_name} & {team.player2_name}</TableCell>
                                <TableCell align="right">{team.games_played}</TableCell>
                                <TableCell align="right">{team.wins}</TableCell>
                                <TableCell align="right">{team.losses}</TableCell>
                                <TableCell align="right">{team.win_rate.toFixed(1)}%</TableCell>
                                <TableCell align="right">{team.avg_score}</TableCell>
                                <TableCell align="right">{team.total_points.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};