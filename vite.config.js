import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ArtPortfolio/', // important for GitHub Pages project sites
});
