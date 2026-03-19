import { handleNoResult } from '@/core/api-server/utils'
import { fetchDirtyDOM } from '@/core/api-server/utils/fetch-dom'
import { getText } from '@/utils/get-selection-more'

export async function getWebsterWordOfTheDay (): Promise<string> {
  const doc = await fetchDirtyDOM('https://www.merriam-webster.com/word-of-the-day')
  const text = getText(doc, 'title')
  const matchResult = text.match(/Word of the Day: (.+) \| Merriam-Webster/)
  return (matchResult && matchResult[1]) || handleNoResult()
}
