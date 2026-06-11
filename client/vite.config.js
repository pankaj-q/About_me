import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function removeCrossorigin() {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, '<script type="module"')
        .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"');
    },
  };
}

export default defineConfig({
  plugins: [react(), removeCrossorigin()],
  base: '/',
  build: {
    outDir: 'dist',
  },
});
