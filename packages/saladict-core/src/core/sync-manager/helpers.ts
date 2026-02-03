import { Word } from '../../store/selection/types'
import { getWords } from '../../core/database/read'
import { saveWords } from '../../core/database/write'
import {
  getSyncMeta,
  setSyncMeta,
  deleteSyncMeta
} from '../../core/database/sync-meta'
import { I18nManager } from '../i18n-manager'

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

export async function notifyError (
  id: string,
  error: Error | string,
  msgPrefix = '',
  msgPostfix = ''
): Promise<void> {
  const { i18n } = await I18nManager.getInstance()
  await i18n.loadNamespaces('sync')
  const errorText = typeof error === 'string' ? error : error.message
  const msgPath = `sync:${id}.error.${errorText}`
  const msg = i18n.exists(msgPath)
    ? i18n.t(msgPath)
    : `Unknown error: ${errorText}`

  browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('assets/icon-128.png'),
    title: `Saladict ${i18n.t(`sync:${id}.title`)}`,
    message: msgPrefix + msg + msgPostfix,
    eventTime: Date.now() + 20000,
    priority: 2
  })
}
