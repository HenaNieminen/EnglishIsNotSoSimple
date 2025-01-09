import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: [
                '@emotion/react',
                '@emotion/styled',
                'react-router-dom',
                'react-toastify',
                'react-toastify/dist/ReactToastify.css',
                '@mui/material',
                'axios',
                'joi',
                'prop-types',
            ]
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:3000", // Adjust the port to your backend's port
        },
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, "../node_modules/react"),
            "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
        },
        preserveSymlinks: true,
    },
    cacheDir: path.resolve(__dirname, "../.vite-cache"), // Set cache directory outside frontend
});
