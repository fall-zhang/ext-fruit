import './root.scss'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/locales/i18n'
import { ConfProvider } from '@/context/conf-context'
import { use, useEffect, useState } from 'react'
import type { AppConfig } from '@/config/app-config'
import type { AppProfile } from '@/config/trans-profile'
import { ThemeProvider } from '@/context/theme-context'
import { getLocalConfig, updateConfig } from '@/core/local-store/setting-store'
import { getLocalProfile, updateProfile } from '@/core/local-store/profile-store'
const RootLayout = () => {
  const [config, setConfig] = useState<AppConfig>()
  const [profile, setProfile] = useState<AppProfile>()
  // const newConf = use(getLocalConfig())
  // console.log('⚡️ line:16 ~ newConf: ', newConf)
  useEffect(() => {
    let ignore = false
    getLocalConfig().then(res => {
      if (ignore) {
        return
      }
      setConfig(res)
    }).catch(err => {
      console.warn('init file system err, cannot use locale config', err)
    })
    getLocalProfile().then(res => {
      if (ignore) {
        return
      }
      setProfile(res)
    }).catch(err => {
      console.warn('init file system err, cannot use locale config', err)
    })
    return () => {
      ignore = true
    }
  }, [])
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <ConfProvider
            config={config}
            profile={profile}
            updateConfig={updateConfig}
            updateProfile={updateProfile}>
            <Outlet />
          </ConfProvider>
        </ThemeProvider>
      </I18nextProvider>
      <TanStackRouterDevtools position='bottom-right'/>
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
