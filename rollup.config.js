// import css from 'rollup-plugin-css-only'
import path from 'node:path'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
// import sucrase from '@rollup/plugin-sucrase'
import resolve from '@rollup/plugin-node-resolve'
// import terser from '@rollup/plugin-terser'
import languages from './build/support-languages.js'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'rollup'
import jsx from 'rollup-plugin-jsx'
import less from 'rollup-plugin-less'
import lessModules from 'rollup-plugin-less-modules'
import { string } from 'rollup-plugin-string'
import scss from 'rollup-plugin-scss'
import bundleScss from 'rollup-plugin-bundle-scss'
import typescript from '@rollup/plugin-typescript'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const langLocation = (fileName) => {
  return path.resolve(__dirname, 'packages/_locales/' + fileName)
}
const distConfig = defineConfig({
  // clean: true,
  // sourcemap: 'inline',
  input: languages.map((lang) => langLocation(lang)),
  external: ['react', 'react-dom', 'react-redux'],
  output: [{
    format: 'es',
    dir: './libs/lang',
    entryFileNames: '[name].ts',
    chunkFileNames: '[name]-[hash].ts',
    exports: 'named',
    plugins: [],
    manualChunks: []
  }],
  plugins: [
    json(),
    less(),
    lessModules(),
    scss({ fileName: 'bundle.css' }),
    bundleScss(),
    jsx({ factory: 'React.createElement' }),
    typescript(),
    string({
      // Required to be specified
      include: '**/*.html'
      // Undefined by default
      // exclude: ['**/index.html']
    }),
    alias({
      entries: [
        // { find: 'packages/', replacement: '@/' },
        { find: '@/', replacement: path.join(__dirname + 'packages/') }
      ]
    }),
    // 让 Rollup 查找到外部模块，打包到产物内
    resolve({
      // 将自定义选项传递给解析插件
      moduleDirectories: ['node_modules']
    })
  ]
})

const libConfig = defineConfig({
  // clean: true,
  input: 'packages/content/index.tsx',
  external: ['react', 'react-dom', 'react-redux'],
  output: [{
    format: 'es',
    dir: './libs',
    entryFileNames: 'main.ts',
    chunkFileNames: '[name].ts',
    exports: 'named',
    plugins: [],
    manualChunks: []
  }],
  plugins: [
    json(),
    less(),
    lessModules(),
    scss({ fileName: 'bundle.css' }),
    bundleScss(),
    jsx({ factory: 'React.createElement' }),
    typescript(),
    string({
      // Required to be specified
      include: '**/*.html'
      // Undefined by default
      // exclude: ['**/index.html']
    }),
    // terser(),
    alias({
      entries: [
        { find: '@/', replacement: path.join(__dirname + 'packages/') }
      ]
    }),
    // 让 Rollup 查找到外部模块，打包到产物内
    resolve({
      // 将自定义选项传递给解析插件
      moduleDirectories: ['node_modules']
    })
  ]
})

export default () => {
  return defineConfig([
    libConfig,
    distConfig
  ])
}

// 如果打包时间过长，添加缓存功能
