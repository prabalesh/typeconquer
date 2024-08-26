// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Allows Vite to accept connections from other devices
        port: 5173, // Optional: specify a port if needed
        strictPort: true, // Optional: ensures the port is not shared with another process
    },
});
