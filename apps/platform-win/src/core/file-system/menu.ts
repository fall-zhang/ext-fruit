import type { FileItem } from '@P/common/types/File'
import { getFileNameInfo, getFileType } from '@P/common/utils/file'
import type { DirRecursiveEntry } from '../types/fileSystem'
import { simplifyFilePath } from '../bridge/path-utils'

/**
 * 将系统的文件列表信息，转换为相对 workspace 路径文本信息
 * 将 filePath C:\Users\132\AppData\abc\workspace\abc\foo.md -> /abc/foo.md
 */
export function transLocalFileList (fileList:DirRecursiveEntry[], workspaceDir?:string):FileItem[] {
  const webFileList = fileList.map(fileItem => {
    const fileNameInfo = getFileNameInfo(fileItem.name || '')
    const filePath = simplifyFilePath(fileItem.path, workspaceDir)
    const fileType = getFileType(fileNameInfo.suffix)
    const fileInfo:FileItem = {
      fileName: fileNameInfo.name,
      filePath,
      fileType,
      fileSuffix: fileNameInfo.suffix
    }
    if (Array.isArray(fileItem.children)) {
      fileInfo.children = transLocalFileList(fileItem.children, workspaceDir)
    }
    return fileInfo
  })
  return webFileList
}


/**
 * 获取根据本地文件列表信息
 * 补充文件系统无法获取到的 fileScheme createTime lastModifyTime
 */
export function getMenuByFile (fileList:FileItem[]) {
  const workspaceFile = fileList.filter(item => item.filePath !== '/.conf')
  const result = genMenuByFile(workspaceFile)
  return result
}
function genMenuByFile (fileList:FileItem[]):FileItem[] {
  return fileList.map(item => {
    const result:FileItem = getMenuFullConf(item)
    if (item.children) {
      result.children = genMenuByFile(item.children)
    }
    return result
  })
}
type MenuFixReturn = {
  hasError: boolean,
  newMenu: FileItem[]
}
/**
 * 修复文件中保存的菜单文件和系统的真实菜单文件
 * @param menuListSaved 保存的菜单文件
 * @param sysFileList 系统的菜单文件
 */
export function menuListFix (menuListSaved:FileItem[], sysFileList:FileItem[]):MenuFixReturn {
  let curMenuErr = false
  let curMenuList:FileItem[] = []
  if (menuListSaved.length !== sysFileList.length) {
    curMenuErr = true
  }
  try {
    const menuMap:Record<string, FileItem> = {}
    menuListSaved.forEach((item) => { menuMap[item.filePath] = item })
    curMenuList = sysFileList.map((item) => {
      let sameFile:FileItem = {
        fileName: '',
        filePath: '',
        fileType: 'error-file',
        fileSuffix: ''
      }
      if (menuMap[item.filePath]) {
        sameFile = menuMap[item.filePath]
      } else {
        curMenuErr = true
      }
      let fileChildren:FileItem[] | undefined
      if (item.children) {
        const { newMenu, hasError } = menuListFix(sameFile.children || [], item.children)
        fileChildren = newMenu
        if (hasError) {
          curMenuErr = true
        }
      }
      // 如果文件信息相同，不需要更新
      if (sameFile.fileName === item.fileName && sameFile.fileSuffix === item.fileSuffix) {
        return {
          ...sameFile,
          children: fileChildren
        }
      }
      // 文件不相同，说明是新文件，初始化
      return getMenuFullConf(item)
    })
    // console.log('🚀 ~ curMenuList=sysFileList.map ~ curMenuList:', curMenuList)
  } catch (err) {
    // console.warn('🚀 ~ menuListFix ~ err:', err)
    curMenuErr = true
  }
  // 走完一整个循环，以 sysFileList 为准，恢复 menuListSaved 的值
  return {
    hasError: curMenuErr,
    newMenu: curMenuList
  }
}

function getMenuFullConf (fileInfo:FileItem):FileItem {
  const { fileName, fileType, filePath, fileSuffix } = fileInfo
  const menuConf:FileItem = {
    fileName,
    fileType,
    filePath,
    fileSuffix,
    fileScheme: undefined, // 根据事务的重要程度或者是分类，更改菜单的颜色
    fileSize: 2014,
    fileSizeReadable: '1.9k',
    // icon?: string | ReactElement
    lastModifyTime: '2024-01-01 12:00:00',
    createTime: '2024-01-01 12:00:00'
  }
  return menuConf
}
