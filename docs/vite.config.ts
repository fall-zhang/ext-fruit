import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// import * as path  from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'),
      // '@P': path.resolve(__dirname, '../packages'),
    }
  },
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths() // 使用 tsconfig 中的 path
  ]
})
