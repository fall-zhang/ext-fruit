// 该文件用作单个工作区内所有文件的操作
// 包括 /workspace /.conf 以及目录下的文件
// tauri 提供的 fs API 无法访问文件系统的任意路径
import { BaseDirectory, mkdir as createDir, exists, writeTextFile, readTextFile as readFile, rename as renameFile, remove as removeFile, readDir } from '@tauri-apps/plugin-fs'
import { join, sep } from '@tauri-apps/api/path'

import { parseJSON, stringifyObject } from '@P/common/utils/json'
import leftMenuConf from '@P/common/virtualFileSystem/initial-file/left-menu'
import { MENU_CONFIG_VERSION, UNCAUGHT_VERSION } from '@P/common/virtualFileSystem/const/version'
import { WORKSPACE_DEFAULT_DIR } from '@P/common/virtualFileSystem/const/filsName'

import type { OperateResult } from '@P/common/types/FileSystem'
import type { FileItem, FileJSON } from '@P/common/types/File'
import type { MenuConfigJSON } from '@P/common/types/ConfigFile'
import type { DirRecursiveEntry } from '../types/fileSystem'
import { convertPathToLocal } from './path-utils'


/**
 * 获取最近打开的工作区（工作区功能待开发）
 */
export const getRecentWorkspace = ():string[] => {
  return ['workspace']
}

/**
 * 新增文件
 * @param {FileItem} fileInfo 文件信息
 * @param {string} content 文件内容
 * @example addFile({
 *   fileName: 'test',
 *   filePath: '/.conf/test.json',
 *   fileType: 'config',
 *   fileSuffix: 'json'
 * }, "test test")
 */
export const addTextFile = async (fileInfo: FileItem, content: string): Promise<OperateResult> => {
  const result:OperateResult<string> = {
    state: 'failure',
    msg: '添加文件失败'
  }
  const touchResult = await touchDir(fileInfo.filePath)
  if (touchResult.state === 'failure') {
    console.warn('当前文件路径有问题', fileInfo.filePath)
    return result
  }
  const fileName = await convertPathToLocal(fileInfo.filePath)
  result.state = 'success'
  result.msg = '添加文件成功'
  await writeTextFile(fileName, content, { baseDir: BaseDirectory.AppConfig })
  return result
}
/**
 * 以 string 形式读取文件内容
 * @param fileInfo 文件信息
 */
export const readTextFile = async (fileInfo: FileItem): Promise<OperateResult<string>> => {
  const result:OperateResult<string> = {
    state: 'failure',
    msg: '读取文件失败',
    data: ''
  }
  const touchResult = await touchDir(fileInfo.filePath)
  const fileName = await convertPathToLocal(fileInfo.filePath)
  if (touchResult.state === 'failure') {
    console.warn('当前文件的路径有问题', fileInfo)
    return result
  }
  result.data = await readFile(fileName, { baseDir: BaseDirectory.AppConfig })
  return result
}

/**
 * 新增 JSON 文件
 * @param fileInfo 文件信息
 * @param json 对象
 */
export const addJSONFile = async (fileInfo: FileItem, json: FileJSON): Promise<OperateResult> => {
  const result:OperateResult = {
    state: 'failure',
    msg: '添加文件失败'
  }
  const touchResult = await touchDir(fileInfo.filePath)
  if (touchResult.state === 'failure') {
    console.warn('当前文件路径有问题', fileInfo.filePath)
    return result
  }
  const fileName = await convertPathToLocal(fileInfo.filePath)
  result.state = 'success'
  result.msg = '添加文件成功'
  await writeTextFile(fileName, stringifyObject(json), { baseDir: BaseDirectory.AppConfig })
  return result
}

/**
 * 读取 JSON 文件
 * @param filePath 文件路径 /dirname/global.json
 */
export const readJSONFile = async (fileInfo: FileItem): Promise<OperateResult> => {
  const result:OperateResult<FileJSON> = {
    state: 'failure',
    msg: '读取文件失败'
  }
  // const localPath = convertPathToLocal(fileInfo.filePath)
  const touchResult = await touchDir(fileInfo.filePath)
  if (touchResult.state === 'failure') {
    console.warn('当前文件路径有问题', fileInfo.filePath)
    return result
  }
  const localFilePath = await convertPathToLocal(fileInfo.filePath)
  const jsonText = await readFile(localFilePath, { baseDir: BaseDirectory.AppConfig })
  try {
    const json = parseJSON(jsonText)
    result.data = json
    result.state = 'success'
    result.msg = '读取文件成功'
  } catch (err) {
    console.warn('🚀 ~ readJSONFile ~ err:', err)
    result.data = {
      version: UNCAUGHT_VERSION,
      fileType: 'error-file',
      data: {}
    }
  }
  return result
}
/**
 * 更新文件信息
 * @param oldInfo 旧文件信息
 * @param newInfo 新的文件信息
 * @returns 更新的结果
 */
export async function updateFileName (oldInfo:FileItem, newInfo:FileItem):Promise<OperateResult> {
  const result:OperateResult = {
    state: 'failure',
    msg: '更新文件信息失败'
  }

  const oldFileName = await convertPathToLocal(oldInfo.filePath)
  const newFileName = await convertPathToLocal(newInfo.filePath)
  await renameFile(oldFileName, newFileName, {
    newPathBaseDir: BaseDirectory.AppData,
    oldPathBaseDir: BaseDirectory.AppData
  })
  result.state = 'success'
  result.msg = '文件名称更新成功'
  return result
}

/**
 * 文件路径是否存在，不存在则创建文件夹
 * @param {string} filePath 文件路径 /dirname/README.md
 * 创建失败则返回 false
 */
export async function touchDir (filePath:string):Promise<OperateResult> {
  const result:OperateResult = {
    state: 'failure',
    msg: '创建文件夹失败'
  }
  let localFile = filePath
  if (filePath.at(0) === '/') {
    localFile = filePath.slice(1)
  }
  const localDirItemList = localFile.split('/')
  const lastItemIsFile = localDirItemList.at(-1)?.includes('.')
  if (lastItemIsFile) {
    localDirItemList.pop()
  }
  result.state = 'success'
  result.msg = '创建文件夹成功'
  if (localDirItemList.length === 0) {
    return result
  }
  const localFileDir = await join(WORKSPACE_DEFAULT_DIR, ...localDirItemList)
  const fileExistStatus:boolean = await exists(localFileDir, { baseDir: BaseDirectory.AppData })
  if (fileExistStatus) {
    return result
  }
  // 将文件的路径拆分为渐进的路径
  let fileDirList:string[] = []
  if (localDirItemList.length > 1) {
    localDirItemList.reduce((left, right) => {
      fileDirList.push(left + '/' + right)
      return left + '/' + right
    })
  } else {
    fileDirList = [localDirItemList[0]]
  }
  const fileExistList = fileDirList.map(async (pathItem:string) => {
    const isDirExist = await exists(pathItem, { baseDir: BaseDirectory.AppData })
    if (!isDirExist) {
      await createDir(await join(WORKSPACE_DEFAULT_DIR, pathItem), { baseDir: BaseDirectory.AppData })
    }
  })
  await Promise.allSettled(fileExistList)
  return result
}

export async function updateMenuConf (fileList:FileItem[]):Promise<OperateResult> {
  const result:OperateResult = {
    state: 'failure',
    msg: '更新菜单配置失败'
  }
  const menuConfig:MenuConfigJSON = {
    version: MENU_CONFIG_VERSION,
    data: fileList,
    fileType: 'config',
    configType: 'menu-config'
  }
  await addJSONFile(leftMenuConf, menuConfig)
  result.state = 'success'
  result.msg = '更新菜单成功'
  return result
}

export async function updateWorkspaceConf (fileList:FileItem[]):Promise<OperateResult> {
  const result:OperateResult = {
    state: 'failure',
    msg: '更新菜单配置失败'
  }
  const menuConfig:MenuConfigJSON = {
    version: MENU_CONFIG_VERSION,
    data: fileList,
    fileType: 'config',
    configType: 'menu-config'
  }
  await addJSONFile(leftMenuConf, menuConfig)
  result.state = 'success'
  result.msg = '更新菜单成功'
  return result
}

/**
 * 移除文件或者是文件夹
 * @param fileInfo 文件信息
 */
export async function removeFileOrDir (fileInfo:FileItem):Promise<OperateResult> {
  // console.log('🚀 ~ removeFileOrDir ~ fileInfo:', fileInfo)
  const result:OperateResult = {
    state: 'failure',
    msg: '删除文件失败'
  }
  try {
    const removeFilePath = await convertPathToLocal(fileInfo.filePath)
    // console.log('🚀 ~ removeFileOrDir ~ removeFilePath:', removeFilePath)
    if (fileInfo.fileType === 'folder') {
      await removeFile(removeFilePath, { baseDir: BaseDirectory.AppData })
    } else {
      await removeFile(removeFilePath, { baseDir: BaseDirectory.AppData })
    }
    result.state = 'success'
    result.msg = '删除文件成功'
  } catch (err) {
    console.warn(err)
    if (typeof err === 'string' && err.includes('目录不是空的')) {
      result.msg = '当前目录中存在文件，无法删除'
    }
  }
  return result
}

/**
 * 获取对应路径下的嵌套的文件列表，如果为空，默认为 workspace 下的用户文件目录
 * rootPath: workspace 或
 */
export async function getDirFileList (rootPath?:string):Promise<DirRecursiveEntry[]> {
  const dirFileInfo:DirRecursiveEntry[] = []
  // 没有 workspace 文件夹，就会创建新的文件夹并且初始化
  if (rootPath) {
    const dirFiles = await readDir(rootPath, {
      baseDir: BaseDirectory.AppData
      // recursive: true
    })
    for (const item of dirFiles) {
      // eslint-disable-next-line no-await-in-loop
      const fileAbsPath = await join(rootPath, item.name)
      if (item.isDirectory) {
        // eslint-disable-next-line no-await-in-loop
        const dirChildren = await getDirFileList(fileAbsPath)
        dirFileInfo.push({
          ...item,
          children: dirChildren,
          path: fileAbsPath
        })
      } else {
        dirFileInfo.push({
          ...item,
          path: fileAbsPath
        })
      }
    }
  } else {
    const dirFiles = await readDir(WORKSPACE_DEFAULT_DIR, {
      baseDir: BaseDirectory.AppData
      // recursive: true
    })
    for (const item of dirFiles) {
      // eslint-disable-next-line no-await-in-loop
      const fileAbsPath = await join(WORKSPACE_DEFAULT_DIR, item.name)
      if (item.isDirectory) {
        // eslint-disable-next-line no-await-in-loop
        const dirChildren = await getDirFileList(fileAbsPath)
        dirFileInfo.push({
          ...item,
          children: dirChildren,
          path: fileAbsPath
        })
      } else {
        dirFileInfo.push({
          ...item,
          path: fileAbsPath
        })
      }
    }
  }
  return dirFileInfo
}
