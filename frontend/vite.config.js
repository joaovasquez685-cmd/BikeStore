import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Para GitHub Pages: VITE_BASE=/BikeStore/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5173 },
})
