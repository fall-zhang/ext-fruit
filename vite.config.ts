/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './packages/saladict-core/src'),
      '@P': resolve(__dirname, './packages')
    }
  },
  plugins: [
    react()
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
