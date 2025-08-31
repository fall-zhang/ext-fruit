import standard from './eslint-standard.config.mjs'
import lintReact from 'eslint-plugin-react'
import jslint from '@eslint/js'
import lintReactHooks from 'eslint-plugin-react-hooks'
// import tailwind from 'eslint-plugin-tailwindcss'
import tslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

const defaultConfig = {
  plugins: {
    react: lintReact,
    '@stylistic': stylistic,
    'react-hooks': lintReactHooks
  },
  settings: { react: { version: '18.3' } },
  rules: {
    // 对引入的内容进行排序：是否忽略大小写
    // 'sort-imports': ["error", { "ignoreCase": false }],
    // 交给 tslint 处理
    // 'no-unused-vars': 'off',
    // 异步处理
    // react
    'react/no-this-in-sfc': 1,
    'react/jsx-indent': [1, 2],
    'react/prop-types': 0,
    'react/display-name': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // typescript
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/no-import-type-side-effects': 'error', // 类型引入方式限制为 import type {A} from 'foo'
    '@typescript-eslint/no-unused-expressions': 'off'
    // @stylistic
    // '@stylistic/prop-types': 0,
    // '@stylistic/display-name': 'off',
    // '@stylistic/jsx-uses-react': 'off',
    // '@stylistic/react-in-jsx-scope': 'off',
    // '@stylistic/no-unused-expressions': 'off',
    // '@stylistic/jsx-wrap-multilines': ['warn'],
  }
}
const tailwindConfig = {
  settings: {
    tailwindcss: {
      // These are the default values but feel free to customize
      callees: ['classnames', 'clsx', 'ctl', 'cn'],
      // config: 'tailwind.config.js', // returned from `loadConfig()` utility if not provided
      cssFiles: [
        '**/*.css',
        '!**/node_modules',
        '!**/.*',
        '!**/dist',
        '!**/build'
      ],
      cssFilesRefreshRate: 5_000,
      removeDuplicates: true,
      skipClassAttribute: false,
      whitelist: [],
      tags: [], // can be set to e.g. ['tw'] for use in tw`bg-blue`
      classRegex: '^class(Name)?$' // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
    }
  },
  rules: {
    'tailwindcss/no-custom-classname': 0
  }
}

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{tsx,ts,js,jsx}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/dist-ssr/**', '**/coverage/**', '**/temp.js', '**/release/**', '**/target/**']
  },
  jslint.configs.recommended,
  lintReact.configs.flat.recommended,
  lintReact.configs.flat['jsx-runtime'],
  standard, // js 标准配置
  ...tslint.configs.recommended,
  // ...tailwind.configs['flat/recommended'],
  // stylistic.configs.recommended,
  // tailwindConfig,
  defaultConfig
]
