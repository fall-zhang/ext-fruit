import { Store } from '@tauri-apps/plugin-store'
import { join } from '@tauri-apps/api/path'
import { APP_CONFIG_DIR, SEARCH_HISTORY_FILE_NAME } from '../file-system/const/file-name'
import type { PromiseOptResult } from '../file-system/types'
import type { HistoryWord } from '@/types/word'

let appHistoryStore: Store | undefined

export async function getLocalHistory (): Promise<HistoryWord[]> {
  if (!appHistoryStore) {
    const configPath = await join(APP_CONFIG_DIR, SEARCH_HISTORY_FILE_NAME)
    appHistoryStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
    appHistoryStore.set('type', 'search-history')
  }
  return (await appHistoryStore.get<HistoryWord[]>('data')) || []
}

export async function updateHistory (history: HistoryWord[]): PromiseOptResult {
  if (!appHistoryStore) {
    const configPath = await join(APP_CONFIG_DIR, SEARCH_HISTORY_FILE_NAME)
    appHistoryStore = await Store.load(configPath, {
      autoSave: true,
      defaults: {
      },
    })
  }
  await appHistoryStore.set('data', history.slice(0, 100))
  return {
    state: 'success',
    msg: '配置更新成功',
    data: null,
  }
}
