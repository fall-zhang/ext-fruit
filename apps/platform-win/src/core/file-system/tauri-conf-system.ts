// 该文件用作 tauri 和 js 进行通信
import { touchDir, addJSONFile, readJSONFile } from './utils/file-utils'
import type { FileItem } from './types/file-type'
import type { AppConfig } from '@/config/app-config'
import type { PromiseOptResult } from './types'
import type { ConfigFileJSON, ProfileFileJSON } from './types/file-content-type'
import { APP_CONFIG_FILE_NAME, APP_PROFILE_FILE_NAME } from './const/file-name'
import type { AppProfile } from '@/config/trans-profile'
// import i18n from 'i18next'

const configFileInfo: FileItem = {
  name: APP_CONFIG_FILE_NAME,
  path: '.config/' + APP_CONFIG_FILE_NAME,
}
const profileFileInfo: FileItem = {
  name: APP_PROFILE_FILE_NAME,
  path: '.config/' + APP_PROFILE_FILE_NAME,
}

/**
 * 获取全局配置文件
 */
export async function getAppConfig (): PromiseOptResult<ConfigFileJSON> {
  const configRes = await readJSONFile(configFileInfo)
  // if (configRes.state === 'success') {
  //   return configRes
  // }
  return configRes
}

export async function updateConfig (config: AppConfig): PromiseOptResult {
  const touchResult = await touchDir(configFileInfo.path)
  if (touchResult.state === 'failure') {
    console.warn('当前文件路径有问题', configFileInfo.path)
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
    await addJSONFile(configFileInfo, newConf)
  } catch (err) {
    console.warn('更新文件失败', err)
  }
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}

/**
 * 获取当前本地 profile 配置
 */
export async function getAppProfile (): PromiseOptResult<ProfileFileJSON> {
  const profileFile = await readJSONFile(profileFileInfo)
  return profileFile
}


export async function updateProfile (profile: AppProfile): PromiseOptResult {
  const touchResult = await touchDir(configFileInfo.path)
  if (touchResult.state === 'failure') {
    console.warn('当前文件路径有问题', configFileInfo.path)
    return {
      state: 'failure',
      msg: '当前文件路径有问题',
    }
  }
  const newConf: ProfileFileJSON = {
    type: 'app-profile',
    data: profile,
  }
  try {
    await addJSONFile(configFileInfo, newConf)
  } catch (err) {
    console.warn('更新文件失败', err)
  }
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}
