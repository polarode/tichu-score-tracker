import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import { PageTemplate } from "../../../components/PageTemplate";
import { Trans } from "@lingui/react/macro";
import { PlayerRanking } from "./PlayerRanking";
import { TeamRanking } from "./TeamRanking";
import { GameOverview } from "./GameOverview";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>
);

export const Statistics = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tabValue, setTabValue] = useState(() => {
        const tab = searchParams.get("tab");
        return tab === "players" ? 1 : tab === "teams" ? 2 : 0;
    });

    useEffect(() => {
        const tab = searchParams.get("tab");
        const newValue = tab === "players" ? 1 : tab === "teams" ? 2 : 0;
        setTabValue(newValue);
    }, [searchParams]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        const tabName = newValue === 1 ? "players" : newValue === 2 ? "teams" : "overview";
        setSearchParams({ tab: tabName });
    };

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={<Trans>Game Overview</Trans>} />
                    <Tab label={<Trans>Players</Trans>} />
                    <Tab label={<Trans>Teams</Trans>} />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <GameOverview />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <PlayerRanking />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <TeamRanking />
            </TabPanel>
        </PageTemplate>
    );
};

export default Statistics;
