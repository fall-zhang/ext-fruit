import { useSortable } from '@dnd-kit/react/sortable'
import type { ReactNode } from 'react'

export function DndItemContainer ({ id, index, children }: {
  id: string
  index: number
  children: ReactNode
}) {
  const { ref } = useSortable({ id, index })

  return (
    <li ref={ref} className="item">Item {id}
      {children}
    </li>
  )
}
