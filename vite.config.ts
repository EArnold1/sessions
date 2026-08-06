import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "TODO Sessions",
        short_name: "TODO Sessions",
        description: "Offline-first TODO session tracker",
        theme_color: "#0f766e",
        background_color: "#f4efe3",
        display: "standalone",
        start_url: "/",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      },
    }),
  ],
});
