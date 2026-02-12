import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/system-tray/')({
  component: RouteComponent,
})

function RouteComponent () {
  return <div>Hello "/system-tray/"!</div>
}
4