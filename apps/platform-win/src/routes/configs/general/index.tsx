import { createFileRoute } from '@tanstack/react-router'
import { Switch, Select } from 'antd'

import { SaladictForm, type SaladictFormItem } from '../-components/SaladictForm'
import { getConfigPath } from '../-utils/path-joiner'
import { useRef } from 'react'
export const Route = createFileRoute('/configs/general/')({
  component: RouteComponent,
})

function RouteComponent () {
  const formRef = useRef<HTMLFormElement>(null)
  const formItems: SaladictFormItem[] = [
    // {
    //   name: getConfigPath('active'),
    //   valuePropName: 'checked',
    //   children: <Switch />,
    // },
    // {
    //   name: getConfigPath('animation'),
    //   valuePropName: 'checked',
    //   children: <Switch />,
    // },
  ]

  formItems.push(
    {
      name: getConfigPath('darkMode'),
      valuePropName: 'checked',
      children: <Switch />,
    },
    {
      name: getConfigPath('startOnBoot'),
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

  return <div className='flex flex-col h-full'>
    <SaladictForm items={formItems} ref={formRef} />
    <div className="grow"></div>
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="text-xs text-gray-500 text-center">
        <p>当前版本: v0.2.1</p>
        <p className="mt-1">© 2026 Fruit Saladict</p>
      </div>
    </div>
  </div>
}
