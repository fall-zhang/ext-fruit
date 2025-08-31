import type { DirEntry } from '@tauri-apps/plugin-fs'

/**
 * 文件夹嵌套类型
 */
export type DirRecursiveEntry = DirEntry & {
  children?:DirRecursiveEntry[]
  path:string
}
