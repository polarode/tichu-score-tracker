import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { lingui } from "@lingui/vite-plugin";

export default defineConfig({
    base: "/tichu-score-tracker/",
    plugins: [
        react({
            babel: {
                plugins: ["@lingui/babel-plugin-lingui-macro"],
            },
        }),
        lingui(),
    ],
    optimizeDeps: {
        exclude: ["react-cat-paws"],
    },
});
