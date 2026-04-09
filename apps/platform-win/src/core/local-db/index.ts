// 写入操作
export { saveWord, saveWords, deleteWords, deleteWord } from './write'

// 读取操作
export { isInNotebook, getWordsByText, getWords } from './read'

// 同步元数据操作
export { getSyncMeta, setSyncMeta, deleteSyncMeta } from './sync-meta'

// 核心数据库管理
export { getDB, closeDB } from './core'

// 类型定义
export type { DBArea } from './types'
