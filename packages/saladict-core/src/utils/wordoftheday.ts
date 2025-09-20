import { fetchDirtyDOM } from './fetch-dom'
<<<<<<< HEAD:packages/saladict-core/src/utils/wordoftheday.ts
import { handleNoResult, getText } from '@P/trans-api/src/helpers'
=======
import { first } from '@/_helpers/promise-more'
import { handleNoResult, getText } from '@/components/Dictionaries/helpers'
>>>>>>> c908eaa999dbc831b8e70709cf53b61208abd9f2:packages/saladict-core/src/_helpers/wordoftheday.ts

export async function getWordOfTheDay (): Promise<string> {
  if (!process.env.DEBUG) {
    try {
      return await Promise.any([
        getWebsterWordOfTheDay(),
        getDictionaryWordOfTheDay()
      ])
    } catch (e) {
      console.warn(e)
    }
  }
  return 'salad'
}

export async function getWebsterWordOfTheDay (): Promise<string> {
  const doc = await fetchDirtyDOM(
    'https://www.merriam-webster.com/word-of-the-day'
  )
  const text = getText(doc, 'title')
  const matchResult = text.match(/Word of the Day: (.+) \| Merriam-Webster/)
  return (matchResult && matchResult[1]) || handleNoResult()
}

export async function getDictionaryWordOfTheDay (): Promise<string> {
  const doc = await fetchDirtyDOM('https://www.dictionary.com/wordoftheday/')
  const text = getText(doc, 'title')
  const matchResult = text.match(
    /Get the Word of the Day - (.+) \| Dictionary\.com/
  )
  return (matchResult && matchResult[1]) || handleNoResult()
}
