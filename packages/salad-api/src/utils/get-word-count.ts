import memoizeOne from 'memoize-one'
import { matchers, matcherSign } from './detect-lang/reg-util'

const matcherCJK = new RegExp(
  `${matchers.chinese.source}|${matchers.japanese.source}|${matchers.korean.source}`
)

/**
 * 获取，中，英，韩的单词数量
 */
export const getWordCount = memoizeOne((text: string): number => {
  return (
    text
      .replace(new RegExp(matcherSign, 'g'), ' ')
      .replace(new RegExp(matcherCJK, 'g'), ' x ')
      .match(/\S+/g) || ''
  ).length
})
