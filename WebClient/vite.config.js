import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/plus/live-2021/" : "/",
  plugins: [vue(), vuetify({ autoImport: true })],
  build: {
    sourcemap: true,
  },
}));
