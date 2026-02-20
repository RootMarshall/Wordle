import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      'wordles/wordles.json': path.resolve(__dirname, 'node_modules/wordles/wordles.json'),
      'wordles/nonwordles.json': path.resolve(__dirname, 'node_modules/wordles/nonwordles.json'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
