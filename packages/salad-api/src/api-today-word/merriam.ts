import { getText } from '../utils/dom-utils'
import { handleNoResult } from '../utils/error-response'
import { fetchDirtyDOM } from '@/core/api-server/utils/fetch-dom'

export async function getWebsterWordOfTheDay (): Promise<string> {
  const doc = await fetchDirtyDOM('https://www.merriam-webster.com/word-of-the-day')
  const text = getText(doc)
  const matchResult = text.match(/Word of the Day: (.+) \| Merriam-Webster/)
  return (matchResult && matchResult[1]) || handleNoResult()
}
