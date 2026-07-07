import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project under /clickeez-lookup/, so assets must be
  // referenced relative to that subpath. (Vercel serves from the root, where a
  // leading-slash base would also be fine.)
  base: '/clickeez-lookup/',
  plugins: [react()],
  // No dev proxy needed: the app fetches Google's gviz CSV endpoint directly,
  // which sends CORS headers (see src/dataSource.js).
})
