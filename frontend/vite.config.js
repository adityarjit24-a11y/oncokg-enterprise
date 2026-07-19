import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, // Limit ko thoda aur badha diya safety ke liye
    rollupOptions: {
      output: {
        // Safe Code Splitting: React ko touch nahi karenge, baaki heavy libraries ko split karenge
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'charts-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
        }
      }
    }
  }
})