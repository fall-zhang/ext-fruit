import { getWords } from '@/core/index-db'
import type { Word } from '@/types/word'

export async function getNotebook (): Promise<Word[]> {
  return (await getWords({ area: 'notebook' })).words || []
}

