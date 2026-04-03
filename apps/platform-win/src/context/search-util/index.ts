import type { Word } from '@/types/word'
export const getFromHistory = (word: Word, history: Word[]): Word => {
  const currentSearch = history.find(item => {
    return item.text === word.text
  })
  return currentSearch || word
}
