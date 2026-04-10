import { DragDropProvider } from '@dnd-kit/react'
import type { ReactNode } from 'react'

export function DndProvider (props: {
  children: ReactNode
}) {
  return (
    <DragDropProvider>
      {props.children}
    </DragDropProvider>
  )
}
