import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve as pathResolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    visualizer({
      open: true,
      filename: 'build/analyze.html',
    }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 7799,
    strictPort: true,
    open: false,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  // optimizeDeps: {
  //   include: []
  // },
  resolve: {
    preserveSymlinks: false,
    alias: {
      'saladict-core': pathResolve(__dirname, '../../packages/saladict-core/src'),
      '@P': pathResolve(__dirname, '../../packages'),
      '@UI': pathResolve(__dirname, '../../packages/ui'),
      '@C': pathResolve(__dirname, '../platform-web/src/components'),
      '@U': pathResolve(__dirname, '../platform-web/src/utils'),
      '@H': pathResolve(__dirname, '../platform-web/src/hooks'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          antd: ['antd'],
        },
      },
    },
  },
}
)
