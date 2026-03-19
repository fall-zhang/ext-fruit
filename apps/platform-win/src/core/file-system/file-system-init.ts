// 每次打开时，都会初始化内容
import { BaseDirectory, mkdir as createDir, exists, readDir, readTextFile, writeFile } from '@tauri-apps/plugin-fs'
import { appDataDir, join } from '@tauri-apps/api/path'
import { APP_CONFIG_DIR, APP_CONFIG_FILE_NAME, APP_PROFILE_FILE_NAME } from './const/file-name'
import type { AppConfig } from '@/config/app-config'
import type { ProfileMutable } from '@/config/trans-profile'
import type { FileItem } from './types/file-type'
import { addJSONFile, addTextFile } from './utils/file-utils'
import { defaultConfig, defaultProfile } from './init-files/config'
import type { OperateResult, PromiseOptResult } from './types'
import { getAppProfile, getAppConfig } from './get-config-files'

export type AllInfo = {
  fileList: FileItem[]
  config: AppConfig
  profile: ProfileMutable
}

export async function initFileSystem (): PromiseOptResult<AllInfo> {
  const { state } = await initCheck()
  const errRes = {
    state: 'failure',
    msg: '文件系统初始化失败',
  } as const
  if (state === 'failure') {
    console.error('文件系统初始化失败，可能是配置已经更改，请报 issue')
    return errRes
  }
  const rootRes = await Promise.all([getAppConfig(), getAppProfile()])
  if (rootRes[0].state === 'success' && rootRes[1].state === 'success') {
    return {
      state: 'success',
      msg: '应用获取成功',
      data: {
        fileList: [],
        config: rootRes[0].data.data,
        profile: rootRes[1].data.data,
      },
    }
  }

  return errRes
}


/**
 * 初始化检查文件系统中的内容，并且进行逐一补全
 */
async function initCheck (): Promise<OperateResult> {
  const appDir = await appDataDir()
  const appConfDir = await join(appDir, APP_CONFIG_DIR)
  try {
    const res = await Promise.allSettled([
      exists(appDir),
      exists(appConfDir),
      exists(await join(appConfDir, APP_CONFIG_FILE_NAME)),
      exists(await join(appConfDir, APP_PROFILE_FILE_NAME)),
    ])
    const appendFileList = []
    if (res[0].status === 'rejected' || res[0].value === false) {
      await createDir(appDir)
    }
    if (res[1].status === 'rejected' || res[1].value === false) {
      await createDir(appConfDir)
    }
    if (res[2].status === 'rejected' || res[2].value === false) {
      appendFileList.push(addJSONFile({
        name: APP_CONFIG_FILE_NAME,
        path: await join(appConfDir, APP_CONFIG_FILE_NAME),
      }, defaultConfig()))
    }
    if (res[3].status === 'rejected' || res[3].value === false) {
      appendFileList.push(addJSONFile({
        name: APP_PROFILE_FILE_NAME,
        path: await join(appConfDir, APP_PROFILE_FILE_NAME),
      }, defaultProfile()))
    }
    await Promise.all(appendFileList)
    return {
      state: 'success',
      msg: '文件系统初始化成功',
      data: null,
    }
  } catch (err) {
    console.warn('初始化文件检查出现错误', err)
    return {
      state: 'failure',
      msg: '文件系统初始化失败',
    }
  }
}
