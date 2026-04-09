// 写入操作
export { saveWord, saveWords, deleteWords, deleteWord } from './write'

// 读取操作
export { isInNotebook, getWordsByText, getWords } from './read'

// 核心数据库管理
export { getDB, closeDB } from './core'

// 类型定义
export type { DBArea } from './types'
