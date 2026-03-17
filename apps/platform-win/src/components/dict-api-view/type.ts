import type { DictID } from '@/core/api-server/config'
import type { Word } from '@/types/word'

export interface ViewProps<T> {
  result: T
  searchText: <P = { [index: string]: any }>(arg?: {
    id?: DictID
    word?: Word
    payload?: P
  }) => any
}
