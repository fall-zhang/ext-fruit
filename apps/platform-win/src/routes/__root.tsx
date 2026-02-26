import { ConfirmProvider } from '@/context/confirm-context'
import './root.scss'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
const RootLayout = () => {
  return (
    <>
      <ConfirmProvider>
        <Outlet />
      </ConfirmProvider>
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
