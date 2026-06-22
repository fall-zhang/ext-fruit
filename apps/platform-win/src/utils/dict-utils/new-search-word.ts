import type { Word } from '@/types/word'
import { uuid } from '../uuid'

export function newWord (word?: Partial<Word>): Word {
  return {
    id: uuid(),
    date: word?.date ?? Date.now(),
    text: word?.text ?? '',
    context: word?.context ?? '',
    trans: word?.trans ?? '',
    note: word?.note ?? '',
    from: 'auto',
    to: 'auto',
  }
}
