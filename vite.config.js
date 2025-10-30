import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Replace REPO_NAME with your repository name (case-sensitive).
  // If deploying to username.github.io (root site), use base: '/' instead.
  base: '/ArtPortfolio/',
  plugins: [react()],
})
