import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // 🔥 THE MAGIC FIX: Ye line ensure karegi ki poore app mein React ki sirf ek copy ho
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Warning ko chup karane ke liye limit badha di, manual chunking hata di
    chunkSizeWarningLimit: 3000, 
  }
})