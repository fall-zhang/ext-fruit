import type { Word } from '../../types/word'
import { getWords } from '../database'

export async function getNotebook (): Promise<Word[]> {
  return (await getWords({ area: 'notebook' })).words || []
}

