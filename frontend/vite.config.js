import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: mode === 'development' ? {
      '/api': {
        target: process.env.VITE_API_URL || "https://tripscout-backend.onrender.com"
        ,
        changeOrigin: true,
        secure: false
      }
    } : {}
  }
}))