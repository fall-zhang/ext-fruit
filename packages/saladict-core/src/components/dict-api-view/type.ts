import type { DictID } from '@P/api-server/types/all-dict-conf'
import type { Word } from '../../types/word'

export interface ViewProps<T> {
  result: T
  searchText: <P = { [index: string]: any }>(arg?: {
    id?: DictID
    word?: Word
    payload?: P
  }) => any
}
