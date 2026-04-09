import { getDB } from './core'
import type { DBArea } from './types'
import type { Word } from '../../types/word'

/**
 * 保存单个单词（存在则更新）
 */
export async function saveWord ({ area, word }: { area: DBArea; word: Word }): Promise<void> {
  const db = await getDB()

  await db.execute(
    `INSERT OR REPLACE INTO ${area} (date, text, context, trans, note, from, to) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [word.date, word.text, word.context, word.trans, word.note, word.from || null, word.to || null]
  )
}

/**
 * 批量保存单词（存在则更新）
 */
export async function saveWords ({ area, words }: { area: DBArea; words: Word[] }): Promise<void> {
  if (import.meta.env.VITE_DEBUG) {
    if (words.length !== new Set(words.map(w => w.date)).size) {
      console.error('saveWords: duplicate records')
    }
  }

  const db = await getDB()

  // 使用事务批量插入
  for (const word of words) {
    // eslint-disable-next-line no-await-in-loop
    await db.execute(
      `INSERT OR REPLACE INTO ${area} (date, text, context, trans, note, from, to) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [word.date, word.text, word.context, word.trans, word.note, word.from || null, word.to || null]
    )
  }
}

/**
 * 删除单词
 * @param keyList 如果提供则删除指定 keys，否则清空整个表
 */
export async function deleteWords ({ area, keyList }: { area: DBArea; keyList?: number[] }): Promise<void> {
  const db = await getDB()

  if (Array.isArray(keyList)) {
    // 批量删除指定的记录
    for (const key of keyList) {
      // eslint-disable-next-line no-await-in-loop
      await db.execute(`DELETE FROM ${area} WHERE date = $1`, [key])
    }
  } else {
    // 清空整个表
    await db.execute(`DELETE FROM ${area}`)
  }
}
/**
 * 删除单词
 * @param keyList 如果提供则删除指定 keys，否则清空整个表
 */
export async function deleteWord ({ area, key }: { area: DBArea; key: number }): Promise<void> {
  const db = await getDB()


  await db.execute(`DELETE FROM ${area} WHERE date = $1`, [key])
  // return {}
}
