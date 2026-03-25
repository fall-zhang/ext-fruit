import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'
import { Switch, Select, Slider } from 'antd'
import { useTranslation } from 'react-i18next'

import { getConfigPath } from '../-utils/path-joiner'
import { SaladictForm } from '../-components/SaladictForm'
import { useConfContext } from '@/context/conf-context'

export const Route = createFileRoute('/configs/popup/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'menus'])
  const menuAll = useConfContext().config.contextMenus.all
  const menusIds = Object.keys(menuAll)

  const { availWidth } = window.screen

  return (
    <SaladictForm
      items={[
        {
          name: getConfigPath('baOpen'),
          children: (
            <Select>
              <Select.Option value="popup_panel">
                {t('config.opt.baOpen.popup_panel')}
              </Select.Option>
              <Select.Option value="popup_fav">
                {t('config.opt.baOpen.popup_fav')}
              </Select.Option>
              <Select.Option value="popup_options">
                {t('config.opt.baOpen.popup_options')}
              </Select.Option>
              <Select.Option value="popup_standalone">
                {t('config.opt.baOpen.popup_standalone')}
              </Select.Option>
              {menusIds.map(id => (
                <Select.Option key={id} value={id}>
                  {t(`menus:${id}`)}
                </Select.Option>
              ))}
            </Select>
          ),
        },
        {
          name: getConfigPath('baWidth'),
          hide: values => values[getConfigPath('baOpen')] !== 'popup_panel',
          children: (
            <Slider
              min={-1}
              max={availWidth}
              marks={{
                '-1': '-1',
                450: '450px',
                [availWidth]: `${availWidth}px`,
              }}
            />
          ),
        },
        {
          name: getConfigPath('baHeight'),
          hide: values => values[getConfigPath('baOpen')] !== 'popup_panel',
          children: (
            <Slider
              min={250}
              max={availWidth}
              marks={{
                250: '250px',
                550: '550px',
                [availWidth]: `${availWidth}px`,
              }}
            />
          ),
        },
        {
          name: getConfigPath('baPreload'),
          label: t('preload.title'),
          help: t('preload.help'),
          hide: values => values[getConfigPath('baOpen')] !== 'popup_panel',
          children: (
            <Select>
              <Select.Option value="">{t('common:none')}</Select.Option>
              <Select.Option value="clipboard">
                {t('preload.clipboard')}
              </Select.Option>
              <Select.Option value="selection">
                {t('preload.selection')}
              </Select.Option>
            </Select>
          ),
        },
        {
          name: getConfigPath('baAuto'),
          label: t('preload.auto'),
          help: t('preload.auto_help'),
          hide: values =>
            values[getConfigPath('baOpen')] !== 'popup_panel' ||
            !values[getConfigPath('baPreload')],
          valuePropName: 'checked',
          children: <Switch />,
        },
      ]}
    />
  )
}
