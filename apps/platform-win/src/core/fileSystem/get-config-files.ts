import type { FileItem } from '@P/common/types/File'
import { getMenuConfigList, initCheck } from './file-system-init'
import { addJSONFile, getDirFileList, readJSONFile } from '../bridge/file-utils'
import type { DirRecursiveEntry } from '../types/fileSystem'
import { GENERAL_CONFIG_FILE, WORKSPACE_LIST_FILE } from '@P/common/virtualFileSystem/const/filsName'
import { menuListFix, transLocalFileList } from './menu'
import { appDataDir } from '@tauri-apps/api/path'
import type { MenuConfigJSON, WorkspaceConfigJSON, WorkspaceListJSON } from '@P/common/types/ConfigFile'
import { MENU_CONFIG_VERSION } from '@P/common/virtualFileSystem/const/version'
import leftMenuConf from '@P/common/virtualFileSystem/initial-file/left-menu'

/**
 * 获取文件列表
 * @returns {FileItem[]} 浏览器使用格式的文件列表
 */
export async function getInitFileList (sysFileList:FileItem[]):Promise<FileItem[]> {
  let menuResult = await getMenuConfigList()
  // 对比 config 和 文件内容是否不同
  const { hasError, newMenu } = menuListFix(menuResult, sysFileList)
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


/**
 * 获取全局配置文件
 */
export async function getRootConfig ():Promise<WorkspaceConfigJSON> {
  const conf = await readJSONFile({
    fileName: '',
    filePath: '/.conf/' + GENERAL_CONFIG_FILE,
    fileType: 'config',
    fileSuffix: 'json'
  })
  return conf.data as WorkspaceConfigJSON
}
/**
 * 获取全局配置文件
 */
export async function getWorkSpaceList ():Promise<WorkspaceListJSON> {
  const conf = await readJSONFile({
    fileName: '',
    filePath: '/.conf/' + WORKSPACE_LIST_FILE,
    fileType: 'config',
    fileSuffix: 'json'
  })
  return conf.data as WorkspaceListJSON
}
