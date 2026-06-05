import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Google's CSV export sends no CORS headers, so the browser can't fetch it
    // cross-origin. In dev we proxy /sheet/* -> docs.google.com to dodge CORS.
    proxy: {
      '/sheet': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sheet/, ''),
      },
    },
  },
})
