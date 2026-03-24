import { createFileRoute } from '@tanstack/react-router'
import { useRef, type FC } from 'react'
import { Switch } from 'antd'
import { getConfigPath } from '../-utils/path-joiner'
import { SaladictForm } from '../-components/SaladictForm'

export const Route = createFileRoute('/configs/privacy/')({
  component: RouteComponent,
})

function RouteComponent () {
  const ref = useRef(null)

  return <SaladictForm
    ref={ref}
    items={[
      {
        name: getConfigPath('updateCheck'),
        valuePropName: 'checked',
        children: <Switch />,
      },
      {
        name: getConfigPath('analytics'),
        valuePropName: 'checked',
        children: <Switch />,
      },
      {
        name: getConfigPath('searchHistory'),
        valuePropName: 'checked',
        children: <Switch />,
      },

      {
        key: 'third_party_privacy',
        children: <Switch disabled checked />,
      },
    ]}
  />
}
