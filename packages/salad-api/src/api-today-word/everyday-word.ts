import { getText } from '../utils/dom-utils'
import { handleNoResult } from '../utils/error-response'
import { fetchDirtyDOM } from './utils'


export async function getWordOfTheDay (): Promise<string> {
  try {
    return await Promise.any([
      getWebsterWordOfTheDay(),
      getDictionaryWordOfTheDay(),
    ])
  } catch (e) {
    console.warn(e)
  }
  return 'salad'
}

async function getWebsterWordOfTheDay (): Promise<string> {
  const doc = await fetchDirtyDOM('https://www.merriam-webster.com/word-of-the-day')
  const text = getText(doc, 'title')
  const matchResult = text.match(/Word of the Day: (.+) \| Merriam-Webster/)
  return (matchResult && matchResult[1]) || handleNoResult()
}

async function getDictionaryWordOfTheDay (): Promise<string> {
  const doc = await fetchDirtyDOM('https://www.dictionary.com/wordoftheday/')
  const text = getText(doc, 'title')
  const matchResult = text.match(
    /Get the Word of the Day - (.+) \| Dictionary\.com/
  )
  return (matchResult && matchResult[1]) || handleNoResult()
}
