import { Word } from '../store/selection/types'

export function newWord (word?: Partial<Word>): Word {
  return {
    date: word?.date ?? Date.now(),
    text: word?.text ?? '',
    context: word?.context ?? '',
    title: word?.title ?? '',
    url: word?.url ?? '',
    favicon: word?.favicon ?? '',
    trans: word?.trans ?? '',
    note: word?.note ?? ''
  }
}
