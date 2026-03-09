import type { Word } from '../../types/word'
import { getDB } from './core'
import type { DBArea } from 'apps/browser-extension/src/utils/record-manager'

/** Is a word in Notebook */
export async function isInNotebook (word: Word):Promise<boolean> {
  const db = await getDB()
  return db.notebook
    .where('text')
    .equalsIgnoreCase(word.text)
    .count()
    .then(count => count > 0)
}

export async function getWordsByText ({
  area,
  text,
}: {
  area: DBArea
  text: string
}) {
  const db = await getDB()
  return db[area]
    .where('text')
    .equalsIgnoreCase(text)
    .toArray()
}

type WordsFilter = {
  area: DBArea
  itemsPerPage?: number
  pageNum?: number
  sortField?: string | string []
  sortOrder?: 'ascend' | 'descend'
  searchText?: string
}

export async function getWords ({
  area,
  itemsPerPage,
  pageNum,
  sortField = 'date',
  sortOrder = 'descend',
  searchText,
}: WordsFilter): Promise<{
  total: number
  words: Word[]
}> {
  const db = await getDB()
  let sortFields :string | string[]
  if (sortField) {
    if (Array.isArray(sortField)) {
      sortFields = sortField.map(str => String(str))
    } else {
      sortFields = String(sortField)
    }
  } else {
    sortFields = 'date'
  }

  const collection = db[area].orderBy(sortFields)

  if (!sortOrder || sortOrder === 'descend') {
    collection.reverse()
  }

  if (searchText) {
    const ls = searchText ? searchText.toLocaleLowerCase() : ''
    collection.filter(record => {
      const isMatch = Object.values(record).some(value =>
        typeof value === 'string' && value.toLocaleLowerCase().includes(ls)
      )

      return isMatch
    })
  }

  const total = await collection.count()

  if (typeof itemsPerPage !== 'undefined' && typeof pageNum !== 'undefined') {
    collection.offset(itemsPerPage * (pageNum - 1)).limit(itemsPerPage)
  }

  const words = await collection.toArray()

  return { total, words }
}
