import lintReact from 'eslint-plugin-react'
import jslint from '@eslint/js'
import lintReactHooks from 'eslint-plugin-react-hooks'
// import tailwind from 'eslint-plugin-tailwindcss'
import tslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import standard from 'eslint-config-standard-new'
const defaultConfig = {
  plugins: {
    react: lintReact,
    'react-hooks': lintReactHooks,
    '@stylistic': stylistic,
  },
  settings: { react: { version: '19.2' } },
  languageOptions: {
    parserOptions: {
      projectService: true,
      ecmaFeatures: {
        jsx: true,
      },
      globals: {
        ...globals.browser,
      },
      tsconfigRootDir: import.meta.dirname,
    },
  },
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
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports', // 强制使用 `import type`
        fixStyle: 'separate-type-imports', // 修复风格：分离的`import type`语句
        // 或者使用 "inline-type-imports" 来修复为内联的 `{ type ... }` 形式
      },
    ],
    '@stylistic/comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],
    '@stylistic/type-annotation-spacing': 'error',
    '@stylistic/type-generic-spacing': ['error'],
    '@stylistic/type-named-tuple-spacing': ['error'],
    '@stylistic/jsx-closing-tag-location': 'error',
    '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
    '@stylistic/jsx-equals-spacing': ['error', 'never'],
    '@stylistic/jsx-indent': ['error', 2],
    // @stylistic
    // '@stylistic/prop-types': 0,
    // '@stylistic/display-name': 'off',
    // '@stylistic/jsx-uses-react': 'off',
    // '@stylistic/react-in-jsx-scope': 'off',
    // '@stylistic/no-unused-expressions': 'off',
    // '@stylistic/jsx-wrap-multilines': ['warn'],
  },
}

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{tsx,ts,js,jsx}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/dist-ssr/**', '**/coverage/**', '**/temp.js', '**/release/**', '**/target/**'],
  },
  jslint.configs.recommended,
  lintReact.configs.flat.recommended,
  lintReact.configs.flat['jsx-runtime'],
  standard, // js 标准配置
  ...tslint.configs.recommended,
  // ...tailwind.configs['flat/recommended'],
  // stylistic.configs.recommended,
  // tailwindConfig,
  defaultConfig,
]
