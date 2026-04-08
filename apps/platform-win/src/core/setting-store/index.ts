// frontend/src/store.js
import { Store } from '@tauri-apps/plugin-store'
import { APP_CONFIG_DIR, APP_CONFIG_FILE_NAME, APP_PROFILE_FILE_NAME } from '../file-system/const/file-name'
import { join } from '@tauri-apps/api/path'
import type { AppConfig } from '@/config/app-config'
import type { PromiseOptResult } from '../file-system/types'
import type { AppProfile } from '@/config/trans-profile'

let appConfigStore: Store | undefined
let appProfileStore: Store | undefined

export async function getLocalConfig (): Promise<AppConfig> {
  if (!appConfigStore) {
    const configPath = await join(APP_CONFIG_DIR, APP_CONFIG_FILE_NAME)
    appConfigStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
    appConfigStore.set('type', 'app-config')
  }
  return (await appConfigStore.get<AppConfig>('data'))!
}

export async function updateConfig (config: AppConfig): PromiseOptResult {
  if (!appConfigStore) {
    const configPath = await join(APP_CONFIG_DIR, APP_PROFILE_FILE_NAME)
    appConfigStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
  }
  await appConfigStore.set('data', config)
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}

export async function getLocalProfile (): Promise<AppProfile> {
  if (!appProfileStore) {
    const configPath = await join(APP_CONFIG_DIR, APP_PROFILE_FILE_NAME)
    appProfileStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
    appProfileStore.set('type', 'app-profile')
  }
  return (await appProfileStore.get<AppProfile>('data'))!
}

export async function updateProfile (config: AppProfile): PromiseOptResult {
  if (!appProfileStore) {
    const configPath = await join(APP_CONFIG_DIR, APP_PROFILE_FILE_NAME)
    appProfileStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
  }
  await appProfileStore.set('data', config)
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}
