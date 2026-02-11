import { createFileRoute } from '@tanstack/react-router'
import { NoteBook } from '@P/saladict-core/main'
export {
  NoteBook
}

/**
 * 生词本
 */

export const Route = createFileRoute('/dict-view/')({
  component: RouteComponent,
})

function RouteComponent () {
  return <div className='w-100 h-100 relative'>
    <NoteBook/>
  </div>
}
