import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    historyApiFallback: true, // This handles client-side routing in dev
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  }
})
