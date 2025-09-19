import type { SupportFileSuffix, SupportFileType } from '../types/File'
/**
 * 是否是合格的文件名称（同时符合多个平台要求）
 * @param 文件名称
 * @returns 是否是合格的文件名称
 */
export function isValidFileName (fileName:string):boolean {
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
export function isValidateFileSuffix (fileName:string):boolean {
  return false
}
/**
 * 获取文件类型名称
 * @param {string} suffix
 * @returns {string}
 * 多个后缀名可能只有一个文件类型
 */
export function getFileType (suffix:string):SupportFileType {
  if (['md', 'mdx'].includes(suffix)) {
    return 'markdown'
  } else if (['json'].includes(suffix)) {
    // 如果后缀名是 json 需要进一步分析文件中的内容
    return 'unknown'
  } else if (suffix.length === 0) {
    return 'folder'
  }
  return 'unknown'
}
/**
 * 通过文件类型获取文件后缀名
 * @param {string} fileType
 * @returns {string}
 * 多个后缀名可能只有一个文件类型
 */
export function getFileSuffix (fileType:SupportFileType):SupportFileSuffix {
  if (['folder', 'unknown'].includes(fileType)) {
    return ''
  } else if (['config', 'flow', 'timeline', 'todo', 'board', 'gantt'].includes(fileType)) {
    return 'json'
  } else if (['markdown'].includes(fileType)) {
    return 'md'
  }
  console.warn('该文件还没有定义后缀')
  return ''
}
/**
 * 获取文件类型名称
 * @param {string} fileSuffix
 * @returns {string}
 */
function getFileLocalName (fileSuffix:SupportFileSuffix):string {
  return 'markdown'
}

/**
 * 获取文件的大小（可读）
 * @param {number} fileSize
 * @returns
 */
export function getFileSizeReadable (fileSize:number):string {
  const result = fileSize + ''
  return 'kb'
}
type FileNameInfo = {
  name: string;
  currentNum: number;
  suffix: SupportFileSuffix;
}
/**
 * 从文件名称中获取信息
 * @param fullName 文件名称 example(12).md
 * @param isFolder 是否为文件夹
 */
export function getFileNameInfo (fullName:string, isFolder = false):FileNameInfo {
  // 获取使用 () 包裹的数字，表示当前序号
  const currentNum = fullName.match(/\(\d{1,3}\)/)
  const result:FileNameInfo = {
    name: '',
    currentNum: 0,
    suffix: ''
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
  } else if (lastDot !== -1) {
    const splitArr:string[] = fullName.split('.')
    const suffix = splitArr.pop() as SupportFileSuffix
    const supportSuffixList:SupportFileSuffix[] = ['md', 'mdx', '', 'json', 'jsonc']
    if (suffix) {
      result.suffix = suffix
      result.name = splitArr.join('.')
      if (!supportSuffixList.includes(suffix)) {
        console.warn('该文件后缀名不支持，文件名称为', fullName)
        return result
      }
    } else {
      console.warn('找不到 file suffix', fullName)
    }
  } else {
    result.name = fullName
  }
  return result
}
