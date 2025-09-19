import { useEffect, useState } from 'react'
import { useConfigSystem } from './useConfigSystem'
import type { ThemeType } from '../types/ConfigFile'

let darkThemeMatch:MediaQueryList
type ThemeInfo = {
  theme: ThemeType
}
export const useBrowserTheme = () => {
  darkThemeMatch = matchMedia('(prefers-color-scheme: dark)')
  const [themeInfo, setThemeInfo] = useState<ThemeInfo>({
    theme: darkThemeMatch.matches ? 'dark' : 'light'
  })
  useEffect(() => {
    const callback = (e:MediaQueryListEvent) => {
      setThemeInfo({
        theme: e.matches ? 'dark' : 'light'
      })
    }
    darkThemeMatch = matchMedia('(prefers-color-scheme: dark)')
    darkThemeMatch.addEventListener('change', callback)
    return () => darkThemeMatch.removeEventListener('change', callback)
  }, [])

  const conf = useConfigSystem().currentConfig

  useEffect(() => {
    if (conf.theme === 'dark') {
      document.body.className = 'dark'
    } else if (conf.theme === 'light') {
      document.body.className = ''
    } else if (conf.theme === 'auto' && darkThemeMatch.matches) {
      document.body.className = 'dark'
    } else if (conf.theme === 'auto' && !darkThemeMatch.matches) {
      document.body.className = ''
    }
  // 仅在初始化时执行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setNewTheme (themeInfo:ThemeInfo) {
    if (themeInfo.theme === 'dark') {
      document.body.className = 'dark'
    } else if (themeInfo.theme === 'light') {
      document.body.className = ''
    } else {
      if (darkThemeMatch.matches) {
        document.body.className = 'dark'
      } else {
        document.body.className = ''
      }
    }
    setThemeInfo({
      ...themeInfo
    })
  }
  return {
    themeInfo,
    setThemeInfo: setNewTheme
  }
}

export const useConfTheme = () => {
  const theme = useConfigSystem()
  if (theme.currentConfig.theme) {
    //
  }
}
