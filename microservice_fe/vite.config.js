import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change the port if needed
  },
  define: {
    global: 'window',
  },
  build: {
    outDir: 'build', // Match CRA's output directory
  },
  publicDir: 'public', // Specify the public directory
  root: '.', // Specify the project root
})
