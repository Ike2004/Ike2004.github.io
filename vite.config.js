import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'

const githubPagesSpaFallback = {
  name: 'github-pages-spa-fallback',
  closeBundle() {
    copyFileSync('dist/index.html', 'dist/404.html')
    mkdirSync('dist/others', { recursive: true })
    copyFileSync('dist/index.html', 'dist/others/index.html')
    mkdirSync('dist/publication/quantum-labyrinth', { recursive: true })
    copyFileSync(
      'dist/index.html',
      'dist/publication/quantum-labyrinth/index.html',
    )
    mkdirSync('dist/internship/kang-tao', { recursive: true })
    copyFileSync('dist/index.html', 'dist/internship/kang-tao/index.html')
    mkdirSync('dist/internship/roxxem', { recursive: true })
    copyFileSync('dist/index.html', 'dist/internship/roxxem/index.html')
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpaFallback],
})
