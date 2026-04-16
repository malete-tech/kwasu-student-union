import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  publicDir: path.resolve(__dirname, "../../public"),
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["../.."]
    }
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
}));
