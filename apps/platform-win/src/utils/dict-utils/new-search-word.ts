import type { Word } from '@/types/word'

export function newWord (word?: Partial<Word>): Word {
  return {
    date: word?.date ?? Date.now(),
    text: word?.text ?? '',
    context: word?.context ?? '',
    trans: word?.trans ?? '',
    note: word?.note ?? '',
    from: 'auto',
    to: 'auto',
  }
}
