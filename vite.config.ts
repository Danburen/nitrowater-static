import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative assets keep one build portable between the container root and a
  // GitHub Pages project site (/<repo>/). The portal is one static page with
  // direct outbound links, so no server-side rewrite is needed anywhere.
  base: './',
  plugins: [vue(), tailwindcss()],
})
