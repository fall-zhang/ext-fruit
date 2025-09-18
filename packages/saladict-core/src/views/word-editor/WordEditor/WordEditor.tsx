import { FC } from 'react'
import { Notes, NotesProps } from './Notes'
import { SALADICT_EXTERNAL } from '@P/saladict-core/src/core/saladict-state'


export const WordEditor: FC<NotesProps> = props => {
  return (
    <div className={`${SALADICT_EXTERNAL} saladict-theme`}>
      <Notes {...props} />
    </div>
  )
}
