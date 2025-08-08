import { useState } from "react";
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
    <div hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
);

export const Statistics = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <PageTemplate maxWidth="lg" showVersionButton={false}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={<Trans>Players</Trans>} />
                    <Tab label={<Trans>Teams</Trans>} />
                    <Tab label={<Trans>Game Overview</Trans>} />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <PlayerRanking />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <TeamRanking />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <GameOverview />
            </TabPanel>
        </PageTemplate>
    );
};

export default Statistics;