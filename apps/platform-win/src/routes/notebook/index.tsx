import { createFileRoute } from '@tanstack/react-router'
import { WordPage } from './-view/WordPage'

export const Route = createFileRoute('/notebook/')({
  component: RouteComponent,
})

function RouteComponent () {
  return <WordPage area="notebook" />
}
