import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import { Switch, Checkbox, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { useDictStore } from '@P/saladict-core/src/store'
import { SaladictForm, type SaladictFormItem } from '../../SaladictForm'
import { getConfigPath } from '../../../helpers/path-joiner'

const reqSyncService = import.meta.glob('./sync-services/*.tsx')

// 暂不实现该功能
export const Notebook: FC = () => {
  const { t } = useTranslation(['options', 'dicts', 'common', 'sync'])
  const ctxTrans = useDictStore(state => state.config.ctxTrans)
  const syncServiceIds = useRef(Object.keys(reqSyncService)).current
  const [showSyncServices, setShowSyncServices] = useState<{
    [id: string]: boolean
  }>({})


  function syncConfig (config:any) {
    const newConfig = {
      ...config,
    }
    if (config?.webdav && !Object.hasOwn(config.webdav, 'enable')) {
      newConfig.webdav.enable = !!config.webdav.url
    }
    return newConfig
  }


  const formItems: SaladictFormItem[] = [
    {
      name: getConfigPath('editOnFav'),
      valuePropName: 'checked',
      children: <Switch />,
    },
    {
      name: getConfigPath('searchHistory'),
      valuePropName: 'checked',
      children: <Switch />,
    },
    {
      key: getConfigPath('ctxTrans'),
      style: { marginBottom: 10 },
      items: Object.keys(ctxTrans).map(id => ({
        name: getConfigPath('ctxTrans', id),
        valuePropName: 'checked',
        style: { marginBottom: 0 },
        children: <Checkbox>{t(`dicts:${id}.name`)}</Checkbox>,
      })),
    },
  ]

  syncServiceIds.forEach(id => {
    const key = `syncService.btn.${id}`
    const title = t(`sync:${id}.title`)
    formItems.push({
      key,
      label: title,
      children: (
        <Button
          onClick={() =>
            setShowSyncServices(showSyncServices => ({
              ...showSyncServices,
              [id]: true,
            }))
          }
        >{'需要重写的模块，同步配置'}</Button>
      ),
    })
  })

  return (
    <>
      <SaladictForm items={formItems} />
      {'需要重写的模块，同步配置'}
      {syncServiceIds.map(id =>
        React.createElement(reqSyncService(`./${id}.tsx`).default, {
          key: id,
          syncConfig: syncConfigs?.[id],
          show: showSyncServices[id],
          onClose: () =>
            setShowSyncServices(showSyncServices => ({
              ...showSyncServices,
              [id]: false,
            })),
        })
      )}
    </>
  )
}
