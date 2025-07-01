import { Typography, Card, CardContent, Box, Chip, List, ListItem, ListItemText } from "@mui/material";
import changelogData from "../data/changelog.json";
import { PageTemplate } from "../components/PageTemplate";

interface ChangelogEntry {
    version: string;
    date: string;
    changes: string[];
}

export default function ChangelogPage() {
    const changelog: ChangelogEntry[] = changelogData;

    return (
        <PageTemplate maxWidth="md" showVersionButton={false}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Changelog
                </Typography>
            </Box>

            {changelog.map((release) => (
                <Card key={release.version} sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Chip label={`v${release.version}`} color="primary" sx={{ mr: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                {release.date}
                            </Typography>
                        </Box>

                        <List dense>
                            {release.changes.map((change, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                    <ListItemText primary={change} primaryTypographyProps={{ variant: "body2" }} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}
        </PageTemplate>
    );
}
