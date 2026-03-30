import { createFileRoute } from '@tanstack/react-router'
import { ConfForm } from '@/components/f-form'

export const Route = createFileRoute('/configs/form-test')({
  component: RouteComponent,
})

function RouteComponent () {
  return <ConfForm></ConfForm>
}
