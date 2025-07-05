// This is Vite configuration information for the React app.

import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:' + process.env.API_SERVER_PORT,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
