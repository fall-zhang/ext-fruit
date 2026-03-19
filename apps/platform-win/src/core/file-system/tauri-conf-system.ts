// 该文件用作 tauri 和 js 进行通信
import { touchDir, addJSONFile } from './utils/file-utils'
import i18n from '@/locales/i18n'
import type { FileItem } from './types/file-type'
import type { AppConfig } from '@/config/app-config'
import type { PromiseOptResult } from './types'
import type { ConfigFileJSON } from './types/file-content-type'
import type { AppProfile } from '@/config/trans-profile'
import { APP_CONFIG_FILE_NAME } from './const/file-name'
// import i18n from 'i18next'

// tauri 内容应该始终为相对路径
export class TauriConfSystem {
  currentConfig: AppConfig

  constructor (localConf: AppConfig) {
    i18n.changeLanguage(localConf.langCode)
    this.currentConfig = localConf
  }

  getConfig (): AppConfig {
    throw new Error('Method not implemented.')
  }

  async updateConfig (config: AppConfig): PromiseOptResult {
    const fileInfo: FileItem = {
      name: APP_CONFIG_FILE_NAME,
      path: '/.config/' + APP_CONFIG_FILE_NAME,
    }
    const touchResult = await touchDir(fileInfo.path)
    if (touchResult.state === 'failure') {
      console.warn('当前文件路径有问题', fileInfo.path)
      return {
        state: 'failure',
        msg: '当前文件路径有问题',
      }
    }
    const newConf: ConfigFileJSON = {
      type: 'app-config',
      data: config,
    }
    try {
      await addJSONFile(fileInfo, newConf)
      this.currentConfig = config
    } catch (err) {
      console.warn('更新文件失败', err)
    }
    return {
      state: 'success',
      msg: '配置更新成功',
      data: null,
    }
  }

  getProfile (): AppProfile {
    throw new Error('Method not implemented.')
  }

  async updateMenuConfig (): PromiseOptResult {
    return {
      state: 'failure',
      msg: '更新菜单失败，当前方法暂未实现',
    }
  }
}
