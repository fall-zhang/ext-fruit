// 该文件用作 tauri 和 js 进行通信
import type { FileSystem, OperateResult } from '@P/common/types/FileSystem'
import type { ConfigSystem } from '@P/common/types/ConfigSystem'
import type { GlobalConfig, MenuConfigJSON, WorkspaceConfigJSON } from '@P/common/types/ConfigFile'
import type { FileItem, FileJSON } from '@P/common/types/File'
import { touchDir, addJSONFile } from '../bridge/file-utils'
import { GENERAL_CONFIG_FILE } from '@P/common/virtualFileSystem/const/filsName'
import { i18n } from '@/locales/index'
// import i18n from 'i18next'

// tauri 内容应该始终为相对路径
export class TauriConfSystem implements ConfigSystem {
  currentConfig: GlobalConfig

  constructor (localConf:GlobalConfig) {
    i18n.changeLanguage(localConf.language)
    this.currentConfig = localConf
  }

  getConfig (): GlobalConfig {
    throw new Error('Method not implemented.')
  }

  async updateConfig (config: GlobalConfig):Promise<OperateResult> {
    const result:OperateResult<string> = {
      state: 'failure',
      msg: '更新文件失败'
    }
    const fileInfo:FileItem = {
      fileName: '',
      filePath: '/.conf/' + GENERAL_CONFIG_FILE,
      fileType: 'config',
      fileSuffix: 'json'
    }
    const touchResult = await touchDir(fileInfo.filePath)
    if (touchResult.state === 'failure') {
      console.warn('当前文件路径有问题', fileInfo.filePath)
      return result
    }
    const newConf:WorkspaceConfigJSON = {
      fileType: 'config',
      configType: 'global-config',
      data: config,
      version: ''
    }
    try {
      if (fileInfo.fileSuffix === 'json') {
        await addJSONFile(fileInfo, newConf)
        this.currentConfig = config
      } else {
        console.warn('文件类型与文件内容不对应：', fileInfo, newConf)
      }
    } catch (err) {
      console.warn('更新文件失败', err)
    }
    return result
  }

  getMenuConfig (): MenuConfigJSON {
    throw new Error('Method not implemented.')
  }

  async updateMenuConfig () {
    const result:OperateResult<string> = {
      state: 'failure',
      msg: '更新菜单失败，当前方法暂未实现'
    }
    return result
  }
}
