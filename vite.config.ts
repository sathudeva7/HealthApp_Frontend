import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  define: {
    global: {},
  },
  build: {
    outDir: 'build', // Specify the output directory
    assetsDir: 'assets', // Specify the assets directory
  },
  plugins: [react()],
})
