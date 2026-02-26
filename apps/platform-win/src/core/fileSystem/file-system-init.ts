// 每次打开时，都会初始化内容
import { BaseDirectory, mkdir as createDir, exists, readDir, readTextFile } from '@tauri-apps/plugin-fs'
import { addInitConf, addInitFile } from './first-install-init'
import { CONFIG_DIR, GENERAL_CONFIG_FILE, MENU_CONFIG_FILE, WORKSPACE_DEFAULT_DIR, WORKSPACE_LIST_FILE } from '@P/common/virtualFileSystem/const/filsName'
import { appDataDir, join } from '@tauri-apps/api/path'
import leftMenuConf from '@P/common/virtualFileSystem/initial-file/left-menu'
import workspaceConf from '@P/common/virtualFileSystem/initial-file/workspace-conf'
import { transLocalFileList, getMenuByFile, menuListFix } from './menu'
import { addJSONFile, getDirFileList } from '../bridge/file-utils'
import { parseJSON } from '@P/common/utils/json'
import workspaceListConf from '@P/common/virtualFileSystem/initial-file/workspace-list'
import { MENU_CONFIG_VERSION } from '@P/common/virtualFileSystem/const/version'
import type { MenuConfigJSON, WorkspaceConfigJSON, WorkspaceListJSON } from '@P/common/types/ConfigFile'
import type { DirRecursiveEntry } from '../types/fileSystem'
import type { FileItem } from '@P/common/types/File'
import { getInitFileList, getRootConfig, getWorkSpaceList } from './get-config-files'
import { getWorkspaceFileList } from './get-workspace-conf'
type FileCheckRes = {
  path:string | 'workspace'
  hasConfig: boolean,
  hasWorkspace: boolean,
  leakFileList: string[]
}


export type AllInfo = {
  fileList:FileItem[]
  workspaceInfo:WorkspaceListJSON
  config:WorkspaceConfigJSON
}

export async function initFileSystem ():Promise<AllInfo> {
  await initCheck()
  // let sysFileList:DirRecursiveEntry[] = []
  // 有配置文件就不需要初始化
  // if (checkRes.hasConfig) {
  // sysFileList = await getDirFileList()
  // } else {
  // sysFileList = await initFileDir(checkRes)
  // }
  // const appDirPath = await appDataDir()
  // const localFileList = transLocalFileList(sysFileList, appDirPath)
  const localList = await Promise.all([getWorkSpaceList(), getRootConfig()])
  let fileList
  try {
    fileList = await getWorkspaceFileList(localList[0].data.currentPath)
  } catch (err) {
    fileList = await getWorkspaceFileList('workspace')
    localList[0].data.currentPath = 'workspace'
    console.log('无法获取到 currentPath，使用 workspace fileList', fileList)
    console.warn('initFileSystem ~ err:', err)
  }
  return {
    fileList,
    workspaceInfo: localList[0],
    config: localList[1],
  }
}


/**
 * 初始化检查文件系统中的内容
 * @returns hasConfig 是否拥有配置文件
 * @returns hasWorkspace 是否有其它文件
 */
export async function initCheck (): Promise<FileCheckRes> {
  const configPath = await join(await appDataDir(), WORKSPACE_DEFAULT_DIR, CONFIG_DIR)
  const result:FileCheckRes = {
    hasConfig: false,
    hasWorkspace: false,
    leakFileList: [],
    path: configPath,
  }
  try {
    const res = await Promise.allSettled([
      readDir(WORKSPACE_DEFAULT_DIR, {
        baseDir: BaseDirectory.AppData,
        // recursive: true
      }),
      readDir(configPath),
      exists(await join(configPath, MENU_CONFIG_FILE), {
        baseDir: BaseDirectory.AppData,
      }),
      exists(await join(configPath, GENERAL_CONFIG_FILE)),
      exists(await join(configPath, WORKSPACE_LIST_FILE)),
    ])
    if (res[0].status === 'rejected' || res[0].value.length === 0) {
      return result
    }
    // 存在文件，说明 workspace 存在
    if (res[1].status === 'rejected') {
      result.hasWorkspace = true
      result.leakFileList.push(MENU_CONFIG_FILE)
      result.leakFileList.push(GENERAL_CONFIG_FILE)
      return result
    }
    // 判断是否存在其它文件
    result.hasWorkspace = res[0].value.length - res[1].value.length > 0

    if (res[2].status === 'rejected' || !res[2].value) {
      result.leakFileList.push(MENU_CONFIG_FILE)
    }
    if (res[3].status === 'rejected' || !res[3].value) {
      result.leakFileList.push(GENERAL_CONFIG_FILE)
    }
    if (res[4].status === 'rejected' || !res[4].value) {
      result.leakFileList.push(WORKSPACE_LIST_FILE)
    }
    if (result.leakFileList.length === 0) {
      result.hasConfig = true
    }
    return result
  } catch (err) {
    console.warn('初始化文件检查出现错误', err)
    return result
  }
}

/**
 * 对全局配置文件进行检查
 * @param params
 */
export async function globalInitCheck () {

}
/**
 * 对工作区相关文件检查
 * @param sysPath 路径
 * @returns 结果
 */
export async function workspaceInitCheck (sysPath:string | 'workspace') {
  let configPath:string
  if (sysPath === 'workspace') {
    const appDataPath = await appDataDir()
    configPath = await join(appDataPath, WORKSPACE_DEFAULT_DIR, CONFIG_DIR)
  } else {
    configPath = await join(sysPath, CONFIG_DIR)
  }
  const result:FileCheckRes = {
    hasConfig: false,
    hasWorkspace: false,
    leakFileList: [],
    path: configPath,
  }
  try {
    const res = await Promise.allSettled([
      readDir(configPath),
      exists(await join(configPath, MENU_CONFIG_FILE)),
      exists(await join(configPath, GENERAL_CONFIG_FILE)),
    ])
    // 存在文件，说明 workspace 的 .conf 路径存在
    if (res[0].status === 'rejected') {
      result.hasWorkspace = true
      result.leakFileList.push(MENU_CONFIG_FILE)
      result.leakFileList.push(GENERAL_CONFIG_FILE)
      return result
    }
    // 判断是否存在其它文件
    result.hasWorkspace = res[0].value.length - res[0].value.length > 0

    if (res[1].status === 'rejected' || !res[1].value) {
      result.leakFileList.push(MENU_CONFIG_FILE)
    }
    if (res[2].status === 'rejected' || !res[2].value) {
      result.leakFileList.push(GENERAL_CONFIG_FILE)
    }

    if (result.leakFileList.length === 0) {
      result.hasConfig = true
    }
    return result
  } catch (err) {
    console.warn('初始化文件检查出现错误', err)
    return result
  }
}
/**
 * 获取本地保存的 json 配置
 * workspacePath F:\dirName
 */
export async function getMenuConfigList (workspacePath:string = 'workspace') {
  // 没有 workspace 文件夹，就会创建新的文件夹并且初始化
  let menuConfigPath:string
  if (workspacePath === 'workspace') {
    menuConfigPath = await join(WORKSPACE_DEFAULT_DIR, CONFIG_DIR, MENU_CONFIG_FILE)
  } else {
    menuConfigPath = await join(workspacePath, CONFIG_DIR, MENU_CONFIG_FILE)
  }

  // const jsonText = await readTextFile(localFilePath)
  const dirFileInfo = await readTextFile(menuConfigPath, {
    baseDir: BaseDirectory.AppData,
  })
  const menuConfig = parseJSON(dirFileInfo)
  return menuConfig.data as FileItem[]
}

/**
 * 必要的文件补全，初始化文件
 */
export async function initFileDir (checkInfo:FileCheckRes) {
  // 没有 workspace 以及工作区的文件
  const appDataPath = checkInfo.path
  if (!checkInfo.hasConfig && !checkInfo.hasWorkspace) {
    const isDirExist = await exists(appDataPath)
    if (!isDirExist) {
      await createDir(appDataPath)
    }
    // 没有 workspace 文件夹，就会创建新的文件夹并且初始化
    const workspaceExist = await exists(WORKSPACE_DEFAULT_DIR, {
      baseDir: BaseDirectory.AppData,
    })
    if (!workspaceExist) {
      await createDir(WORKSPACE_DEFAULT_DIR, { baseDir: BaseDirectory.AppData })
    }
    await addInitConf()
    await addInitFile()
  }
  const dirFileInfo:DirRecursiveEntry[] = await getDirFileList()
  const fileList = transLocalFileList(dirFileInfo, appDataPath)
  const configPath = appDataPath
  console.log('configPath', configPath)
  // 无配置时执行，添加缺少的配置文件
  if (!checkInfo.hasConfig) {
    const hasConfig = await exists(configPath, {
      baseDir: BaseDirectory.AppData,
    })
    if (!hasConfig) {
      await createDir(configPath, { baseDir: BaseDirectory.AppData })
    }
    const addFileList = []
    if (checkInfo.leakFileList.includes(MENU_CONFIG_FILE)) {
      const menuConfig:MenuConfigJSON = {
        data: getMenuByFile(fileList),
        fileType: 'config',
        configType: 'menu-config',
        version: MENU_CONFIG_VERSION,
      }
      addFileList.push(addJSONFile(leftMenuConf, menuConfig))
    }
    if (checkInfo.leakFileList.includes(GENERAL_CONFIG_FILE)) {
      addFileList.push(addJSONFile(workspaceConf, workspaceConf.content))
    }
    if (checkInfo.leakFileList.includes(WORKSPACE_LIST_FILE)) {
      addFileList.push(addJSONFile(workspaceListConf, workspaceListConf.content))
    }
    await Promise.allSettled(addFileList)
  }
  return dirFileInfo
}
