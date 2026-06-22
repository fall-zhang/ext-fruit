import type { Language } from '../../const/languages'

const langMapList: [Language, string][] = [
  ['auto', 'auto'],
  ['en', 'en'],
  ['zh-CN', 'zh-CHS'],
  ['zh-TW', 'zh-CHT'],
  ['ru', 'ru'],
  ['pt', 'pt'],
  ['es', 'es'],
  ['de', 'de'],
  ['ja', 'ja'],
  ['ko', 'ko'],
  ['fr', 'fr'],
  ['ar', 'ar'],
  ['id', 'id'],
  ['vi', 'vi'],
  ['it', 'it'],
]

export const langMap = new Map(langMapList)

export function truncate (q: string): string {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}
