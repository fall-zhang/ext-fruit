import { createFileRoute } from '@tanstack/react-router'
import { NoteBook } from './-view'

export const Route = createFileRoute('/notebook/')({
  component: RouteComponent,
})

function RouteComponent () {
  return <NoteBook />
}
