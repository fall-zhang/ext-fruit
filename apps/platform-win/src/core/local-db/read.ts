import type { Word } from '../../types/word'
import { getDB, rowToWord } from './core'
import type { DBArea } from './types'

/**
 * 判断某个词是否在生词本中（不区分大小写）
 */
export async function isInNotebook (word: Word): Promise<boolean> {
  const db = await getDB()

  const results = await db.select<Array<{ count: number }>>(
    'SELECT COUNT(*) as count FROM notebook WHERE LOWER(text) = LOWER($1)',
    [word.text]
  )

  return results.length > 0 && results[0].count > 0
}

/**
 * 按文本精确查找词（不区分大小写）
 */
export async function getWordsByText ({ area, text }: { area: DBArea; text: string }): Promise<Word[]> {
  const db = await getDB()

  const results = await db.select<Array<Record<string, unknown>>>(
    `SELECT * FROM ${area} WHERE LOWER(text) = LOWER($1) ORDER BY date DESC`,
    [text]
  )

  return results.map(rowToWord)
}

type WordsFilter = {
  area: DBArea
  itemsPerPage?: number
  pageNum?: number
  sortField?: string | string[]
  sortOrder?: 'ascend' | 'descend'
  searchText?: string
}

/**
 * 高级查询：支持排序、分页、搜索过滤
 */
export async function getWords ({
  area,
  itemsPerPage,
  pageNum,
  sortField = 'date',
  sortOrder = 'descend',
  searchText,
}: WordsFilter): Promise<{ total: number; words: Word[] }> {
  const db = await getDB()

  // 构建排序字段
  let sortFields: string
  if (Array.isArray(sortField)) {
    sortFields = sortField.map(str => String(str)).join(', ')
  } else {
    sortFields = String(sortField)
  }

  const sortDirection = sortOrder === 'descend' ? 'DESC' : 'ASC'

  // 构建基础查询
  let baseQuery = `SELECT * FROM ${area}`
  let countQuery = `SELECT COUNT(*) as count FROM ${area}`
  const params: Array<string | number | null> = []

  // 如果有搜索文本，添加 WHERE 条件
  if (searchText) {
    // const ls = searchText.toLowerCase()
    // SQLite 不支持直接在不区分大小写的情况下搜索所有字段，使用 LOWER
    baseQuery += ` WHERE LOWER(text) LIKE '%' || LOWER($1) || '%' 
                   OR LOWER(context) LIKE '%' || LOWER($1) || '%' 
                   OR LOWER(trans) LIKE '%' || LOWER($1) || '%' 
                   OR LOWER(note) LIKE '%' || LOWER($1) || '%'`
    countQuery = baseQuery.replace('SELECT *', 'SELECT COUNT(*) as count')
    params.push(searchText)
  }

  // 添加排序
  baseQuery += ` ORDER BY ${sortFields} ${sortDirection}`

  // 获取总数
  const countResults = await db.select<Array<{ count: number }>>(countQuery, params)
  const total = countResults.length > 0 ? countResults[0].count : 0

  // 添加分页
  if (typeof itemsPerPage !== 'undefined' && typeof pageNum !== 'undefined') {
    const offset = itemsPerPage * (pageNum - 1)
    baseQuery += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(itemsPerPage, offset)
  }

  // 执行查询
  const results = await db.select<Array<Record<string, unknown>>>(baseQuery, params)

  // 转换为 Word 对象数组
  const words = results.map(rowToWord)

  return { total, words }
}
