import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index () {
  return (
    <div className="p-100">
      <Outlet />
    </div>
  )
}
