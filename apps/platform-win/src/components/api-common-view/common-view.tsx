import type { FC } from 'react'
import type { UnitSearchResult } from '@P/salad-api/src/types/res-type'
import { WordView } from './word-view/word-view'

export const DictBing: FC<UnitSearchResult> = (props) => {
  if (props.type === 'word-trans') {
    return <WordView {...props} />
  }
  return <></>
}

export default DictBing

