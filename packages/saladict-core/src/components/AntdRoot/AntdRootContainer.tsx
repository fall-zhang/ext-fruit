import React, { FC, useEffect, useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { ConfigProvider as AntdConfigProvider } from 'antd'
import langZhCN from 'antd/lib/locale/zh_CN'
import langZhTW from 'antd/lib/locale/zh_TW'
import langEnUS from 'antd/lib/locale/en_US'
import { useSelector } from '@/content/redux'
import { reportPageView } from '@/_helpers/analytics'

const antdLocales = (saladictLocale: string) => {
  switch (saladictLocale) {
  case 'zh-CN':
    return langZhCN
  case 'zh-TW':
    return langZhTW
  default:
    return langEnUS
  }
}

export interface AntdRootContainerProps {
  /** Render Props */
  render: () => React.ReactNode
  /** Analytics path */
  gaPath?: string
}

/** Inner Component so that it can access Redux store */
export const AntdRootContainer: FC<AntdRootContainerProps> = props => {
  const { langCode, analytics, darkMode } = useSelector(state => {
    const { langCode, analytics, darkMode } = state.config
    return { langCode, analytics, darkMode }
  }, shallowEqual)

  const locale = useMemo(() => antdLocales(langCode), [langCode])

  const bgStyles = useMemo(
    () => ({ backgroundColor: darkMode ? '#000' : '#f0f2f5' }),
    [darkMode]
  )

  useEffect(() => {
    if (analytics && props.gaPath) {
      reportPageView(props.gaPath)
    }
  }, [analytics, props.gaPath])

  return (
    <AntdConfigProvider locale={locale}>
      <div style={bgStyles}>{props.render()}</div>
    </AntdConfigProvider>
  )
}
