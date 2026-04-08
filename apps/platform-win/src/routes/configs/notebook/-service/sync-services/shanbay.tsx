import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Modal, Button, Switch, message as AntdMsg, notification } from 'antd'

import { useTranslation } from 'react-i18next'
import { Service, type SyncConfig } from '@/core/external-sync/sync-shanbay'
import type { Word } from '@/types/word'

export interface WebdavModalProps {
  syncConfig?: SyncConfig
  show: boolean
  onClose: () => void
}

export const ShanbayModal: FC<WebdavModalProps> = props => {
  const { t, i18n } = useTranslation(['options', 'common', 'sync'])
  const [syncConfig, setSyncConfig] = useState<SyncConfig>(
    () => props.syncConfig || Service.getDefaultConfig()
  )
  useEffect(() => {
    if (props.syncConfig) {
      setSyncConfig(props.syncConfig)
    }
  }, [props.syncConfig])

  return (
    <Modal
      visible={props.show}
      title={t('sync:shanbay.title')}
      onCancel={props.onClose}
      footer={null}
    >
      <p>{t('syncService.shanbay.description')}</p>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        {t('common:enable')}：
        <Switch checked={syncConfig.enable} onChange={onToggleEnable} />
      </div>
      {syncConfig.enable && (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={onSyncAll} style={{ marginRight: 10 }}>
            {t('syncService.shanbay.sync_all')}
          </Button>
          <Button onClick={onSyncLast}>
            {t('syncService.shanbay.sync_last')}
          </Button>
        </div>
      )}
    </Modal>
  )

  async function onToggleEnable (enable: boolean) {
    const newConfig = {
      ...syncConfig,
      enable,
    }
    if (enable) {
      const service = new Service(newConfig)

      try {
        await service.init()
      } catch (e) {
        Modal.confirm({
          title: t('syncService.shanbay.login'),
          onOk: () => {
            Service.openLogin()
          },
        })
        // return
      }
    }
  }

  async function onSyncAll () {
    // const { total } = await getWords('notebook', {
    //   itemsPerPage: 1,
    //   filters: {},
    // })
    // if (total > 50 && !confirm(t('syncService.shanbay.sync_all_confirm'))) {
    //   return
    // }

    await syncWords()
  }

  async function onSyncLast () {
    // const { words } = await getWords('notebook', {
    //   itemsPerPage: 1,
    //   filters: {},
    // })
    // if (!words || words.length <= 0) {
    //   return
    // }

    // await syncWords(words)
  }

  async function syncWords (words?: Word[]) {
    AntdMsg.destroy()
    AntdMsg.success(t('syncService.start'), 0)

    const service = new Service(syncConfig)

    try {
      const errorCount = await service.addInternal({ words, force: true })
      AntdMsg.destroy()
      if (errorCount > 0) {
        AntdMsg.info(t('syncService.finished'))
      } else {
        AntdMsg.success(t('syncService.success'))
      }
    } catch (error) {
      if (error === 'words') return
      const msgPath = `sync:shanbay.error.${error}`
      notification.error({
        message: t('syncService.failed'),
        description: i18n.exists(msgPath) ? t(msgPath) : `${error}`,
      })
    }
  }
}

export default ShanbayModal
