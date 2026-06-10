import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Set base to your GitHub repo name for GitHub Pages (e.g. /stamping-tool/)
export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/stamping-tool/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['pdfjs-dist'],
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
}))
