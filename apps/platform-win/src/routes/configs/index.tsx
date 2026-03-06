import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/configs/')({
  component: RouteComponent,
})

function RouteComponent () {
  const config = {}
  function updateConf (newConf: unknown) {


  }
  return <div>
    <Outlet />
  </div>
}
