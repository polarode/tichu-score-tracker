import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/tichu-score-tracker/",
    plugins: [react()],
});
