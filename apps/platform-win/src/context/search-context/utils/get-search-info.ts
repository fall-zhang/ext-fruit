import type { Word } from '@/types/word'
import type { SupportLanguage } from '@P/salad-api/src/main'
import { baseLangDetect } from '@P/salad-api/src/utils/detect-lang'
import { getWordCount } from '@P/salad-api/src/utils/get-word-count'

/**
 *
 * @param word 单词
 * @param param1.localLang 本地语言
 * @param param1.preferLang 语言偏好
 * @returns
 */
export const getSearchInfo = (word: Word, { localLang, preferLang }: {
  localLang: SupportLanguage
  preferLang?: SupportLanguage[]
}) => {
  const wordCount = getWordCount(word.text)
  let langFrom
  if (wordCount < 5) {
    langFrom = baseLangDetect(word.text)
  } else {
    langFrom = baseLangDetect(word.text)
  }
  // 可能的目标翻译语言可能和 from 相同，或者为 localLang
  let toLang: SupportLanguage[] = [localLang, langFrom]
  if (!preferLang) {
    if (langFrom === 'zh-CN') {
      toLang.push('en')
    } else if (langFrom === 'en') {
      toLang.push('zh-CN')
    }
  } else {
    toLang = toLang.concat(preferLang || [])
  }
  const dedupeLang = [...new Set(toLang)]
  return {
    wordCount,
    from: langFrom,
    to: dedupeLang,
  }
}
