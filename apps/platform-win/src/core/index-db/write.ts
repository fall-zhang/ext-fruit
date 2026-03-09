import { getDB } from './core'
import type { DBArea } from './types'
import type { Word } from '../../types/word'

export async function saveWord ({
  area,
  word,
}: {
  area: DBArea
  word: Word
}) {
  const db = await getDB()
  return db[area].put(word)
}

export async function saveWords ({
  area,
  words,
}: {
  area: DBArea
  words: Word[]
}) {
  if (process.env.DEBUG) {
    if (words.length !== new Set(words.map(w => w.date)).size) {
      console.error('save Words: duplicate records')
    }
  }
  const db = await getDB()
  return db[area].bulkPut(words)
}

export async function deleteWords ({
  area,
  keyList,
}:{
  area: DBArea
  keyList?: number[]
}) {
  const db = await getDB()
  return Array.isArray(keyList) ? db[area].bulkDelete(keyList) : db[area].clear()
}
