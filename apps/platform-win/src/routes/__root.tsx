import { ConfirmProvider } from '@/context/confirm-context'
import './root.scss'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/locales/i18n'
const RootLayout = () => {
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <ConfirmProvider>
          <Outlet />
        </ConfirmProvider>
      </I18nextProvider>
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
