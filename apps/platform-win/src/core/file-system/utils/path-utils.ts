import { join, sep } from '@tauri-apps/api/path'

/**
 * 将文件系统路径简化，获得统一格式的相对路径
 * @param filePath 文件路径 C:\Users\Administrator\AppData\Roaming\your-folder\workspace\Untitled.md
 * @param removePath 根路径 C:\Users\Administrator\AppData\Roaming\your-folder\
 * @returns  /Untitled.md
 */
export function simplifyFilePath (filePath: string, removePath?: string): string {
  let relativePath: string = filePath
  if (removePath) {
    relativePath = relativePath.replace(removePath, '')
  }
  relativePath = relativePath.split(sep()).join('/')
  return relativePath
}
/**
 * 将浏览器的路径转换为本地文件路径
 * @param path /abc/foo.md
 * @returns c:\my\abc\foo.md
 */
export async function convertPathToLocal (path: string): Promise<string> {
  const pathArr = path.split('/')
  if (pathArr.length === 0) return ''
  const result = await join(...pathArr)
  return result
}
