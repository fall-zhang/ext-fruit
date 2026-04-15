import { Store } from '@tauri-apps/plugin-store'
import { join } from '@tauri-apps/api/path'
import { APP_CONFIG_DIR, SEARCH_HISTORY_FILE_NAME } from '../file-system/const/file-name'
import type { AppConfig } from '@/config/app-config'
import type { PromiseOptResult } from '../file-system/types'

let appHistoryStore: Store | undefined

export async function getLocalConfig (): Promise<AppConfig> {
  if (!appHistoryStore) {
    const configPath = await join(APP_CONFIG_DIR, SEARCH_HISTORY_FILE_NAME)
    appHistoryStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
    appHistoryStore.set('type', 'search-history')
  }
  return (await appHistoryStore.get<AppConfig>('data'))!
}

export async function updateConfig (config: AppConfig): PromiseOptResult {
  if (!appHistoryStore) {
    const configPath = await join(APP_CONFIG_DIR, SEARCH_HISTORY_FILE_NAME)
    appHistoryStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
  }
  await appHistoryStore.set('data', config)
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}
