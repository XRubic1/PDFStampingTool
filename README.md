# PDF Stamping Tool

A single-page React app that stamps your image onto **page 1 only** of multiple PDFs. Everything runs in the browser — no uploads to a server.

## Features

- Drag & drop multiple PDF files
- Live preview of page 1 (first PDF in the queue)
- Upload a PNG or JPG stamp image
- Drag to position, corner handle to resize
- **Stamp** applies the same placement to page 1 of every queued PDF
- Downloads a ZIP (or a single file if only one PDF)

## Local development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a GitHub repo named `stamping-tool` (or update `base` in `vite.config.ts` to match your repo name).
2. Push this project to the `main` branch.
3. In repo **Settings → Pages**, set source to **GitHub Actions**.
4. Push to `main` — the workflow deploys automatically.

Or deploy manually:

```bash
npm run deploy
```

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- [pdf-lib](https://pdf-lib.js.org/) for stamping
- [react-pdf](https://github.com/wojtekmaj/react-pdf) for preview
