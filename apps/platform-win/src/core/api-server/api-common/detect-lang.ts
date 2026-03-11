import type { Language } from '@P/open-trans/languages'
import { isContainJapanese, isContainKorean } from '../utils/lang-check'
import { detectLang } from '@P/open-trans/utils/detect-lang'

type GetTransLang = {
  (
    text: string,
    option: {
      from?: Language
      to?: Language
      localLang?: 'en' | 'zh-CN' | 'zh-TW'
      // 保持换行
      keepLF?: boolean
    }
  ): {
    from: Language
    to: Language
    text: string
  }
}
/**
 * 获取机翻参数，根据配置，获取对应翻译语言
 * detect
 * Get Machine Translate arguments
 * @return 当前语言，目标语言，翻译 text
 */
export const detectLangInfo: GetTransLang = (recText, {
  from,
  to,
  localLang,
  keepLF,
}) => {
  let text = recText
  if (!keepLF) {
    text = recText.replace(/\n+/g, ' ')
  }

  let fromLang: Language

  if (from) {
    fromLang = from
  } else {
    if (isContainJapanese(text)) {
      fromLang = 'ja'
    } else if (isContainKorean(text)) {
      fromLang = 'ko'
    } else {
      fromLang = detectLang(text)
    }
  }

  let toLang: Language
  if (to) {
    toLang = to
  } else {
    // 文本语言不是当前本地语言，则使用本地语言
    if (localLang && fromLang !== localLang) {
      toLang = localLang
      // 中文则转换为英文
    } else if (['zh-CN', 'zh', 'zh-TW'].includes(fromLang)) {
      toLang = 'en'
      // 中文以外语言则转换为中文
    } else {
      toLang = 'zh-CN'
    }
  }

  return {
    from: fromLang,
    to: toLang,
    text: 'string',
  }
}
