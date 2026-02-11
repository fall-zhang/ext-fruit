import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/configs/pdf')({
  component: RouteComponent,
})

function RouteComponent () {
  return <div>Hello  !</div>
}
