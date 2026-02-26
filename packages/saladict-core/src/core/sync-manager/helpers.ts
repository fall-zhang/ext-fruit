import { getWords } from '../../core/database/read'
import { saveWords } from '../../core/database/write'
import {
  getSyncMeta,
  setSyncMeta,
  deleteSyncMeta
} from '../../core/database/sync-meta'
import type { Word } from '../../types/word'

export interface StorageSyncConfig {
  syncConfig: { [id: string]: any }
}

export async function setSyncConfig<T = any> (
  serviceID: string,
  config: T
): Promise<void> {
  const syncConfig:Record<string, any> = {}
  syncConfig[serviceID] = config
}

export async function getSyncConfig<T> (
  serviceID: string
): Promise<T | undefined> {
  const syncConfig:Record<string, any> = {}
  return syncConfig[serviceID]
}

export async function removeSyncConfig (serviceID?: string): Promise<void> {
  if (serviceID) {
    await setSyncConfig(serviceID, null)
  }
}

/**
 * Service meta data is saved with the database
 * so that it can be shared across browser vendors.
 */
export async function setMeta<T = any> (
  serviceID: string,
  meta: T
): Promise<void> {
  await setSyncMeta(serviceID, JSON.stringify(meta))
}

/**
 * Service meta data is saved with the database
 * so that it can be shared across browser vendors.
 */
export async function getMeta<T> (serviceID: string): Promise<T | undefined> {
  const text = await getSyncMeta(serviceID)
  if (text) {
    return JSON.parse(text)
  }
}

/**
 * Service meta data is saved with the database
 * so that it can be shared across browser vendors.
 */
export const deleteMeta = deleteSyncMeta

export async function setNotebook (words: Word[]): Promise<void> {
  await saveWords({ area: 'notebook', words })
}

export async function getNotebook (): Promise<Word[]> {
  return (await getWords({ area: 'notebook' })).words || []
}

