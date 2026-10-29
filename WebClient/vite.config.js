import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/plus/live-2021/" : "/",
  plugins: [vue(), vuetify({ autoImport: true })],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/echarts") || id.includes("node_modules/zrender") || id.includes("node_modules/vue-echarts")) return "echarts";
          if (id.includes("node_modules/vuetify")) return "vuetify";
        },
      },
    },
  },
}));
