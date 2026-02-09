import React, { FC, useState } from 'react'
import { Switch, Checkbox, Button } from 'antd'
import { concat, from } from 'rxjs'
import { pluck, map } from 'rxjs/operators'
import { useObservableState, useObservable, useRefFn } from 'observable-hooks'
import { useTranslation } from 'react-i18next'
import { storage } from '@/_helpers/browser-api'
import { useSelector } from '@/content/redux'
import { getConfigPath } from '@/options/helpers/path-joiner'
import {
  SaladictForm,
  SaladictFormItem
} from '@/options/components/SaladictForm'

const reqSyncService = require.context('./sync-services', false, /\.tsx$/)

export const Notebook: FC = () => {
  const { t } = useTranslation(['options', 'dicts', 'common', 'sync'])
  const ctxTrans = useSelector(state => state.config.ctxTrans)
  const syncServiceIds = useRefFn(() =>
    reqSyncService.keys().map(path => /([^/]+)\.tsx$/.exec(path)![1])
  ).current
  const [showSyncServices, setShowSyncServices] = useState<{
    [id: string]: boolean
  }>({})
  const syncConfigs = useObservableState(
    useObservable(() =>
      concat(
        from(storage.sync.get('syncConfig')).pipe(pluck('syncConfig')),
        storage.sync.createStream('syncConfig').pipe(pluck('newValue'))
      ).pipe(
        map(syncConfig => {
          const newConfig = {
            ...syncConfig
          }
          // legacy fix
          if (
            syncConfig?.webdav &&
            !Object.prototype.hasOwnProperty.call(syncConfig.webdav, 'enable')
          ) {
            newConfig.webdav.enable = !!syncConfig.webdav.url
          }
          return newConfig
        })
      )
    )
  )

  const formItems: SaladictFormItem[] = [
    {
      name: getConfigPath('editOnFav'),
      valuePropName: 'checked',
      children: <Switch />
    },
    {
      name: getConfigPath('searchHistory'),
      valuePropName: 'checked',
      children: <Switch />
    },
    {
      name: getConfigPath('searchHistoryInco'),
      hide: values => !values[getConfigPath('searchHistory')],
      valuePropName: 'checked',
      children: <Switch />
    },
    {
      key: getConfigPath('ctxTrans'),
      style: { marginBottom: 10 },
      items: Object.keys(ctxTrans).map(id => ({
        name: getConfigPath('ctxTrans', id),
        valuePropName: 'checked',
        style: { marginBottom: 0 },
        children: <Checkbox>{t(`dicts:${id}.name`)}</Checkbox>
      }))
    }
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
              [id]: true
            }))
          }
        >{`${title} (${t(
            syncConfigs?.[id]?.enable ? 'common:enabled' : 'common:disabled'
          )})`}</Button>
      )
    })
  })

  return (
    <>
      <SaladictForm items={formItems} />
      {syncServiceIds.map(id =>
        React.createElement(reqSyncService(`./${id}.tsx`).default, {
          key: id,
          syncConfig: syncConfigs?.[id],
          show: showSyncServices[id],
          onClose: () =>
            setShowSyncServices(showSyncServices => ({
              ...showSyncServices,
              [id]: false
            }))
        })
      )}
    </>
  )
}
