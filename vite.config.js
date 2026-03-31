import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: "/Nexathon-V2/",   // IMPORTANT for GitHub Pages

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        about: resolve(__dirname, 'about.html'),
        flashback: resolve(__dirname, 'flashback.html'),
        structure: resolve(__dirname, 'structure.html')
      }
    }
  }
})