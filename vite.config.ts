import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    emptyOutDir: true,
    outDir: './docs',
    minify: true,
  },
  server: {
    port: 20192,
  },
});
