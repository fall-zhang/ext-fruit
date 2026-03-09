import type { WorkspaceInfo, WorkspaceSystem } from '@P/common/types/Workspace'
import { WORKSPACE_DEFAULT_DIR, WORKSPACE_LIST_FILE } from '@P/common/virtualFileSystem/const/filsName'
import { chooseDir } from '../bridge/tauri-util'
import type { FileItem } from '@P/common/types/File'
import type { OperateResult } from '@P/common/types/FileSystem'
import { addJSONFile, touchDir } from '../bridge/file-utils'
import type { WorkspaceListJSON } from '@P/common/types/ConfigFile'
import { sep } from '@tauri-apps/api/path'
import { tauriFileSystem } from './tauri-file-system'
class TauriWorkspaceSystem implements WorkspaceSystem {
  /**
   * 当前工作区的文件系统路径
   */
  currentPath:string = 'workspace'
  workspaceList:WorkspaceInfo[] = []
  // constructor (defaultPath:WorkspaceListJSON) {
  //   this.currentPath = defaultPath.data.currentPath
  //   this.workspaceList = defaultPath.data.list
  // }

  setWorkspaceInfo (defaultPath:WorkspaceListJSON) {
    this.currentPath = defaultPath.data.currentPath
    this.workspaceList = defaultPath.data.list
    console.log('🚀 ~ TauriWorkspaceSystem ~ setWorkspaceInfo ~ defaultPath:', defaultPath)
    this.saveWorkspaceList()
  }

  /**
   * 更改当前工作区的路径
   * @returns
   */
  async changePath (newPath:string) {
    if (newPath === this.currentPath) return
    if (!this.workspaceList.some((item) => item.path === newPath)) {
      this.workspaceList.push({
        name: newPath.split(sep()).at(-1) || '找不到工作区名称',
        path: newPath
      })
    }

    this.currentPath = newPath
    this.saveWorkspaceList()
    tauriFileSystem.onChangeRootPath(newPath)
    await tauriFileSystem.reload()
  }

  /**
   * 获取当前工作区的路径
   */
  getWorkspacePath () {
    return this.currentPath
  }

  /**
   * 获取最近使用的工作区
   */
  getRecentWorkspace ():WorkspaceInfo[] {
    return this.workspaceList
  }

  /**
   * 将工作区信息保存到本地
   */
  async saveWorkspaceList () {
    const result:OperateResult<string> = {
      state: 'failure',
      msg: '更新文件失败'
    }
    const fileInfo:FileItem = {
      fileName: WORKSPACE_LIST_FILE,
      filePath: '/.conf/' + WORKSPACE_LIST_FILE,
      fileType: 'config',
      fileSuffix: 'json'
    }
    const touchResult = await touchDir(fileInfo.filePath)
    if (touchResult.state === 'failure') {
      console.warn('当前文件路径有问题', fileInfo.filePath)
      return result
    }
    const newConf:WorkspaceListJSON = {
      fileType: 'config',
      configType: 'workspace-list',
      data: {
        currentPath: this.currentPath,
        list: this.workspaceList
      },
      version: ''
    }
    try {
      if (fileInfo.fileSuffix === 'json') {
        await addJSONFile(fileInfo, newConf)
      } else {
        console.warn('文件类型与文件内容不对应：', fileInfo, newConf)
      }
    } catch (err) {
      console.warn('更新文件失败', err)
    }
    return result
  }

  /**
   * 读取本地的配置信息，并且返回配置信息
   */
  async readLocalConfig () {
    this.workspaceList = []
    return {
      currentPath: this.currentPath,
      workspaceList: this.workspaceList
    }
  }

  async chooseWorkspace () {
    const dir = await chooseDir()
    const newDir = dir || WORKSPACE_DEFAULT_DIR
    await this.changePath(newDir)

    return newDir
  }
}

export const tauriWorkspaceSystem = new TauriWorkspaceSystem()
