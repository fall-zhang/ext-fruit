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
import less from 'rollup-plugin-less'
import lessModules from 'rollup-plugin-less-modules'
import { string } from 'rollup-plugin-string'
import scss from 'rollup-plugin-scss'
import bundleScss from 'rollup-plugin-bundle-scss'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const langLocation = (fileName:string) => {
  return path.resolve(__dirname, 'packages/_locales/' + fileName)
}
const distConfig = defineConfig({
  // clean: true,
  // sourcemap: 'inline',
  input: languages.map((lang:string) => langLocation(lang)),
  external: ['react', 'react-dom', 'react-redux'],
  output: [{
    format: 'es',
    dir: './libs/lang',
    entryFileNames: '[name].ts',
    chunkFileNames: '[name]-[hash].ts',
    exports: 'named',
    plugins: []
    // manualChunks: []
  }],
  // acornInjectPlugins: [jsx()],
  plugins: [
    json(),
    less(),
    lessModules(),
    scss({ fileName: 'bundle.css' }),
    bundleScss(),
    commonjs(),
    typescript({ compilerOptions: { jsx: 'preserve' } }),
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
  // input: 'example/index.tsx',
  jsx: 'react-jsx',
  external: ['react', 'react-dom', 'react-redux'],
  output: [{
    format: 'es',
    dir: './libs',
    entryFileNames: 'main.js',
    chunkFileNames: '[name].ts',
    exports: 'named',
    plugins: []
  }],
  // acornInjectPlugins: [jsx()],
  plugins: [
    json(),
    less(),
    lessModules(),
    scss({ fileName: 'bundle.css' }),
    bundleScss(),
    commonjs(),
    typescript({ // 默认使用 tsconfig.json 中的 compilerOptions
      // include: [
      //   'example/**/*.tsx'
      // ],
      compilerOptions: {
        // 因为并非提供调用，所以打包后，不需要生成 .d.ts 文件
        // declaration: true
        // emitDeclarationOnly: false
      }
    }),
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
    libConfig
    // distConfig
  ])
}

// 如果打包时间过长，添加缓存功能
