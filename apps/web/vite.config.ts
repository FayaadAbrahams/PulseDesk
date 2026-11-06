import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import {fileURLToPath} from "url";
import {reactRouter} from "@react-router/dev/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [reactRouter(), tailwindcss()],
    resolve: {
        dedupe: ["react", "react-dom"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
