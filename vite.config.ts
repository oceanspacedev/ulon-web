import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Inline PostCSS config stops Vite from picking up C:\Users\AHTAR\postcss.config.mjs
  css: { postcss: {} },
  build: {
    target: 'es2022', // main.tsx awaits the kit's modules at top level
    assetsDir: '_app', // public/assets holds the taste-skill kit; keep Vite's bundles apart from it
  },
})
