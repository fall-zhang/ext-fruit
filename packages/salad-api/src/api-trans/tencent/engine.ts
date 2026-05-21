import type { Language } from '../../const/languages'


const langMap: [Language, string][] = [
  ['auto', 'auto'],
  ['zh-CN', 'zh'],
  ['zh-TW', 'zh-TW'],
  ['de', 'de'],
  ['en', 'en'],
  ['es', 'es'],
  ['fr', 'fr'],
  ['id', 'id'],
  ['it', 'it'],
  ['ja', 'jp'],
  ['ko', 'kr'],
  ['ms', 'ms'],
  ['pt', 'pt'],
  ['ru', 'ru'],
  ['th', 'th'],
  ['tr', 'tr'],
  ['vi', 'vi'],
]
export const tencentLangMap = new Map(langMap)


export function getUTCDate (dateObj: Date): string {
  const year = dateObj.getUTCFullYear()
  const month = `${dateObj.getUTCMonth() + 1}`.padStart(2, '0')
  const date = `${dateObj.getUTCDate()}`.padStart(2, '0')
  return `${year}-${month}-${date}`
}
