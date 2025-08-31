import type { FileItem } from '@P/common/types/File'
import { getMenuConfigList, workspaceInitCheck } from './file-system-init'
import { addJSONFile, getDirFileList } from '../bridge/file-utils'
import type { DirRecursiveEntry } from '../types/fileSystem'
import { getMenuByFile, menuListFix, transLocalFileList } from './menu'
import { join } from '@tauri-apps/api/path'
import type { MenuConfigJSON } from '@P/common/types/ConfigFile'
import { MENU_CONFIG_VERSION } from '@P/common/virtualFileSystem/const/version'
import leftMenuConf from '@P/common/virtualFileSystem/initial-file/left-menu'
import { exists, mkdir as createDir } from '@tauri-apps/plugin-fs'
import { GENERAL_CONFIG_FILE, MENU_CONFIG_FILE } from '@P/common/virtualFileSystem/const/filsName'
import workspaceConf from '@P/common/virtualFileSystem/initial-file/workspace-conf'


/**
 * 获取工作区的文件列表
 * @param {string} sysPath 系统文件目录
 * @returns {FileItem[]} 浏览器使用格式的文件列表
 */
export async function getWorkspaceFileList (sysPath:string):Promise<FileItem[]> {
  const checkRes = await workspaceInitCheck(sysPath)
  let sysFileList:DirRecursiveEntry[] = []
  // 有配置文件就不需要初始化
  if (checkRes.hasConfig) {
    sysFileList = await getDirFileList(sysPath)
  } else {
    sysFileList = await initWorkspaceConf(checkRes)
  }

  const localFileList = transLocalFileList(sysFileList, sysPath)
  let menuResult = await getMenuConfigList(sysPath)
  // 对比 config 和 文件内容是否不同
  const { hasError, newMenu } = menuListFix(menuResult, localFileList)
  if (hasError) {
    menuResult = newMenu
    const menuConfig:MenuConfigJSON = {
      version: MENU_CONFIG_VERSION,
      data: newMenu,
      fileType: 'config',
      configType: 'menu-config'
    }
    addJSONFile(leftMenuConf, menuConfig)
  }
  return menuResult as FileItem[]
}

type FileCheckRes = {
  path:string | 'workspace'
  hasConfig: boolean,
  hasWorkspace: boolean,
  leakFileList: string[]
}
/**
 * 必要的文件补全，初始化文件
 */
export async function initWorkspaceConf (checkInfo:FileCheckRes) {
  // 没有 workspace 以及工作区的文件
  const configPath = checkInfo.path
  const dirPath = await join(configPath, '../')
  const dirFileInfo:DirRecursiveEntry[] = await getDirFileList(dirPath)
  const fileList = transLocalFileList(dirFileInfo, configPath)

  // 无配置时执行，添加缺少的配置文件
  if (!checkInfo.hasConfig) {
    const hasConfig = await exists(configPath)
    if (!hasConfig) {
      await createDir(configPath)
    }
    const addFileList = []
    if (checkInfo.leakFileList.includes(MENU_CONFIG_FILE)) {
      const menuConfig:MenuConfigJSON = {
        data: getMenuByFile(fileList),
        fileType: 'config',
        configType: 'menu-config',
        version: MENU_CONFIG_VERSION
      }
      addFileList.push(addJSONFile(leftMenuConf, menuConfig))
    }
    if (checkInfo.leakFileList.includes(GENERAL_CONFIG_FILE)) {
      addFileList.push(addJSONFile(workspaceConf, workspaceConf.content))
    }
    await Promise.allSettled(addFileList)
  }
  return dirFileInfo
}
