import { createFileRoute } from '@tanstack/react-router'
import { Switch, Select } from 'antd'

import { SaladictForm, type SaladictFormItem } from '../-components/SaladictForm'
import { getConfigPath } from '../-utils/path-joiner'
export const Route = createFileRoute('/configs/general/')({
  component: RouteComponent,
})

function RouteComponent () {
  const formItems: SaladictFormItem[] = [
    {
      name: getConfigPath('active'),
      valuePropName: 'checked',
      children: <Switch />,
    },
    {
      name: getConfigPath('animation'),
      valuePropName: 'checked',
      children: <Switch />,
    },
  ]

  formItems.push(
    {
      name: getConfigPath('darkMode'),
      valuePropName: 'checked',
      children: <Switch />,
    },
    {
      name: getConfigPath('langCode'),
      children: (
        <Select
          options={[
            { label: '简体中文', value: 'zh-CN' },
            { label: '繁體中文', value: 'zh-TW' },
            { label: 'English', value: 'en' },
          ]}
        />
      ),
    }
  )

  return <SaladictForm items={formItems} />
}
