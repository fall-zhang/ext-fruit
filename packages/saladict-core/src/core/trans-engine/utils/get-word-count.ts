import memoizeOne from 'memoize-one'
import { matchers, matcherSign } from './reg-utils'

const matcherCJK = new RegExp(
  `${matchers.chinese.source}|${matchers.japanese.source}|${matchers.korean.source}`
)

export const countWords = memoizeOne((text: string): number => {
  return (
    text
      .replace(new RegExp(matcherSign, 'g'), ' ')
      .replace(new RegExp(matcherCJK, 'g'), ' x ')
      .match(/\S+/g) || ''
  ).length
})
