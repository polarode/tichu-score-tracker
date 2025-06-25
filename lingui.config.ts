import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
    locales: ["en", "de"],
    catalogs: [
        {
            path: "src/locales/{locale}",
            include: ["src"],
        },
    ],
    format: "po",
};

export default config;
