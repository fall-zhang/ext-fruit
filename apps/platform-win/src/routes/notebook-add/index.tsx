import { WordEditorView } from './-view/index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notebook-add/')({
  component: RouteComponent,
})

function RouteComponent () {
  return <WordEditorView/>
}
