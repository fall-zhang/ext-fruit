import { ConfirmProvider } from '@/context/confirm-context'
import './root.scss'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/locales/i18n'
import { ConfProvider } from '@/context/conf-context'
import { useEffect, useState } from 'react'
import { updateConfig } from '@/core/file-system/app-config'
import { updateProfile } from '@/core/file-system/tauri-conf-system'
import { initFileSystem } from '@/core/file-system/file-system-init'
import type { AppConfig } from '@/config/app-config'
import type { AppProfile } from '@/config/trans-profile'
const RootLayout = () => {
  const [config, setConfig] = useState<AppConfig>()
  const [profile, setProfile] = useState<AppProfile>()
  useEffect(() => {
    initFileSystem().then(res => {
      if (res.state === 'success') {
        setConfig(res.data.config)
        setProfile(res.data.profile)
        res.data.fileList
      }
    }).catch(err => {
      console.warn('init file system err, cannot use locale config', err)
    })
  }, [])
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <ConfProvider
          config={config}
          profile={profile}
          updateConfig={updateConfig}
          updateProfile={updateProfile}>
          <ConfirmProvider>
            <Outlet />
          </ConfirmProvider>
        </ConfProvider>
      </I18nextProvider>
      <TanStackRouterDevtools position='bottom-right'/>
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
