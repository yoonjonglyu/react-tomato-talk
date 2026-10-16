import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      'react-tomato-talk': path.resolve(__dirname, '../../packages/react-tomato-talk/src')
    }
  }
});
