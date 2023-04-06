import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  build: {
    emptyOutDir: true,
    outDir: "./dist",
  },
  server: {
    port: 20192,
  },
});
