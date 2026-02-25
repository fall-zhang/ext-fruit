import type { FC } from 'react'
import type { NotesProps } from './Notes'
import { Notes } from './Notes'
import { SALADICT_EXTERNAL } from '@P/saladict-core/src/core/saladict-state'


export const WordEditor: FC<NotesProps> = props => {
  return (
    <div className={`${SALADICT_EXTERNAL} saladict-theme`}>
      <Notes {...props} />
    </div>
  )
}
