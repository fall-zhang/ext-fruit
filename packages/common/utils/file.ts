/**
 * 是否是合格的文件名称（同时符合多个平台要求）
 * @param 文件名称
 * @returns 是否是合格的文件名称
 */
export function isValidFileName (fileName: string): boolean {
  // Windows 文件名规则: 不包含以下字符 \ / : * ? " < > |
  const windowsRegex = /^[^\\/:*?"<>|]+$/

  // Mac OS 文件名规则: 不包含以下字符 /
  const macRegex = /^[^/]+$/

  return windowsRegex.test(fileName) && macRegex.test(fileName)
}
/**
 * 是否是合法的文件 suffix
 * @param fileName 文件的 suffix
 * @returns
 */
export function isValidateFileSuffix (fileName: string): boolean {
  return false
}


/**
 * 获取文件的大小（可读）
 * @param {number} fileSize
 * @returns
 */
export function getFileSizeReadable (fileSize: number): string {
  const result = fileSize + ''
  return 'kb'
}
type FileNameInfo = {
  name: string;
  currentNum: number;
}
/**
 * 从文件名称中获取信息
 * @param fullName 文件名称 example(12).md
 * @param isFolder 是否为文件夹
 */
export function getFileNameInfo (fullName: string, isFolder = false): FileNameInfo {
  // 获取使用 () 包裹的数字，表示当前序号
  const currentNum = fullName.match(/\(\d{1,3}\)/)
  const result: FileNameInfo = {
    name: '',
    currentNum: 0,
  }
  // 文件夹
  if (isFolder) {
    result.name = fullName
    return result
  }
  // 文件
  const lastDot = fullName.lastIndexOf('.')
  if (lastDot === 0) {
    result.name = fullName
  } else {
    result.name = fullName
  }
  return result
}
