import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://xrubic1.github.io/PDFStampingTool/
export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/PDFStampingTool/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['pdfjs-dist'],
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
}))
