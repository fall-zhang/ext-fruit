// import css from 'rollup-plugin-css-only'
import path from 'node:path'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
// import sucrase from '@rollup/plugin-sucrase'
import resolve from '@rollup/plugin-node-resolve'
// import terser from '@rollup/plugin-terser'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'rollup'
import scss from 'rollup-plugin-scss'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const libConfig = defineConfig({
  // clean: true,
  input: './src/main.tsx',
  // input: 'example/index.tsx',
  jsx: 'react-jsx',
  external: ['react', 'react-dom', 'react-redux'],
  output: [{
    format: 'es',
    sourcemap: 'inline',
    dir: './libs',
    entryFileNames: 'main.js',
    chunkFileNames: '[name].ts',
    exports: 'named',
    plugins: []
  }],
  // acornInjectPlugins: [jsx()],
  plugins: [
    json(),
    scss({ fileName: 'bundle.css' }),
    commonjs(),
    typescript({ // 默认使用 tsconfig.json 中的 compilerOptions
      // include: [
      //   'example/**/*.tsx'
      // ],
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: 'react',
        noEmit: true,
        target: 'ES2020',
        paths: {
          '@P/*': [
            '../*'
          ],
          '@/*': [
            './src/*'
          ]
        },
        lib: [
          'ES2023',
          'DOM',
          'DOM.Iterable'
        ],
        outDir: './libs'
        // 因为并非提供调用，所以打包后，不需要生成 .d.ts 文件
        // declaration: true
        // emitDeclarationOnly: false
      }
    }),
    // terser(),
    alias({
      entries: [
        { find: '@/', replacement: path.join(__dirname + './src/') },
        { find: '@P/', replacement: path.join(__dirname + '../') }
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
  ])
}

// 如果打包时间过长，添加缓存功能
