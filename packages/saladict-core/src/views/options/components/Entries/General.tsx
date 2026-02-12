import type { FC } from 'react'
import React from 'react'
import { Switch, Select } from 'antd'
import { getConfigPath } from '@/options/helpers/path-joiner'


import { isFirefox, isOpera } from '@/_helpers/saladict'
import { SaladictForm, type SaladictFormItem } from '../SaladictForm'

export const General: FC = () => {
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

  if (!(isFirefox || isOpera)) {
    formItems.push({
      name: getConfigPath('runInBg'),
      valuePropName: 'checked',
      children: <Switch />,
    })
  }

  formItems.push(
    {
      name: getConfigPath('darkMode'),
      valuePropName: 'checked',
      children: <Switch />,
    },
    {
      name: getConfigPath('langCode'),
      children: (
        <Select>
          <Select.Option value="zh-CN">简体中文</Select.Option>
          <Select.Option value="zh-TW">繁體中文</Select.Option>
          <Select.Option value="en">English</Select.Option>
        </Select>
      ),
    }
  )

  return <SaladictForm items={formItems} />
}
