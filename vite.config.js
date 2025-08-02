// This is Vite configuration information for the React app.

import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxies requests from the frontend to the backend while in development so the request's
    // origin is the same as the backend.
    proxy: {
      '/api': {
        target: 'http://localhost:' + process.env.API_SERVER_PORT,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
