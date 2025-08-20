import { Box, Typography, Chip } from "@mui/material";
import { Trans } from "@lingui/react/macro";

type GameResult = "Win" | "Loss" | "Draw";

interface GameCardProps {
    gameDate: string;
    team1Score: number;
    team2Score: number;
    team1Names: string;
    team2Names: string;
    result?: GameResult;
}

export const GameCard = ({ gameDate, team1Score, team2Score, team1Names, team2Names, result }: GameCardProps) => {
    const team1Won = team1Score > team2Score;
    const team2Won = team2Score > team1Score;

    const getTeam1Color = () => {
        if (result === "Win") return "success.main";
        if (result === "Loss") return "error.main";
        if (team1Won) return "success.main";
        if (team2Won) return "error.main";
        return "text.primary";
    };

    const getTeam2Color = () => {
        if (result === "Loss") return "success.main";
        if (result === "Win") return "error.main";
        if (team2Won) return "success.main";
        if (team1Won) return "error.main";
        return "text.primary";
    };

    return (
        <Box
            sx={{
                mb: 1,
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                backgroundColor: "background.paper",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                    {new Date(gameDate).toLocaleString()}
                </Typography>
                {result && (
                    <Chip
                        label={result}
                        color={result === "Win" ? "success" : result === "Loss" ? "error" : "default"}
                        size="small"
                    />
                )}
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", mb: 0.5 }}>
                <Typography variant="body1" fontWeight="bold" color={getTeam1Color()} sx={{ textAlign: "right" }}>
                    {team1Score}
                </Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>
                    :
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={getTeam2Color()} sx={{ textAlign: "left" }}>
                    {team2Score}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                <Typography variant="caption" color="text.secondary">
                    {team1Names}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
                >
                    <Trans>vs</Trans>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {team2Names}
                </Typography>
            </Box>
        </Box>
    );
};
