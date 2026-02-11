import type { Language } from './src/languages'
export * from './src/languages'

export type Locale = { [key in Language]: string }
