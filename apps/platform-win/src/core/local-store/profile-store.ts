// frontend/src/store.js
import { Store } from '@tauri-apps/plugin-store'
import { join } from '@tauri-apps/api/path'
import { APP_CONFIG_DIR, APP_PROFILE_FILE_NAME } from '../file-system/const/file-name'
import type { PromiseOptResult } from '../file-system/types'
import { getDefaultProfile, type AppProfile } from '@/config/trans-profile'
let appProfileStore: Store | undefined

async function getProfileStore (): Promise<Store> {
  if (appProfileStore) {
    return appProfileStore
  }
  const configPath = await join(APP_CONFIG_DIR, APP_PROFILE_FILE_NAME)
  appProfileStore = await Store.load(configPath, {
    autoSave: false,
    defaults: {},
  })
  return appProfileStore
}

export async function getLocalProfile (): Promise<AppProfile> {
  const store = await getProfileStore()
  const profileData = await store.get<AppProfile>('data')
  if (profileData) {
    return profileData
  }
  const defaultProfile = getDefaultProfile()
  store.set('data', defaultProfile)
  return defaultProfile
}

export async function updateProfile (profile: AppProfile): PromiseOptResult {
  const store = await getProfileStore()
  await store.set('data', profile)
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}
