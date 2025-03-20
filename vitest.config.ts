import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'node:url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './packages')
    }
  },
  plugins: [
  ],
  test: {
    setupFiles: './tests/unit/setup.js',
    // globals: true,
    environment: 'jsdom'
    // browser: {
    //   enabled: true,
    //   headless: true,
    // },
  }
})
