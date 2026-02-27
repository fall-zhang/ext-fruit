import type { AppConfig } from '@P/saladict-core/src/app-config'
import type { Language } from '@P/open-trans/languages'
import type { Translator } from '@P/open-trans/translator'
import { isContainJapanese, isContainKorean } from './utils/lang-check'
export interface MachineTranslatePayload<Lang = string> {
  sl?: Lang
  tl?: Lang
}

type SelOptionType = {
  // 源语言
  from?: Language
  // 目标语言
  to?: Language
  dictOption: {
    tl: 'default' | Language
    tl2: 'default' | Language
    keepLF: 'none' | 'all'
  }
  optionAvailable: {
    tl: ReadonlyArray<'default' | Language>
    tl2: ReadonlyArray<'default' | Language>
  }
  config: AppConfig,
}

/**
 * 获取机翻参数，根据配置，获取对应翻译语言
 *
 * Get Machine Translate arguments
 * @return 当前语言，目标语言，翻译 text
 */
export async function getMTArgsE (
  translator: Translator,
  recText: string,
  opt:SelOptionType
): Promise<{ sl: Language; tl: Language; text: string }> {
  let text = recText
  if (opt.dictOption.keepLF === 'none') {
    text = recText.replace(/\n+/g, ' ')
  }

  let sl = opt.from

  if (!sl) {
    if (isContainJapanese(text)) {
      sl = 'ja'
    } else if (isContainKorean(text)) {
      sl = 'ko'
    }
  }

  if (!sl) {
    sl = await translator.detect(text)
  }

  let tl: Language | '' = ''

  if (opt.to) {
    tl = opt.to
  } else if (opt.dictOption.tl === 'default') {
    if (opt.optionAvailable.tl.includes(opt.config.langCode)) {
      tl = opt.config.langCode
    }
  } else {
    tl = opt.dictOption.tl
  }

  if (!tl) {
    tl = opt.optionAvailable.tl.find((lang): lang is Language => lang !== 'default') || 'en'
  }

  if (sl === tl) {
    if (!opt.to) {
      if (opt.dictOption.tl2 === 'default') {
        if (tl !== opt.config.langCode) {
          tl = opt.config.langCode
        } else if (tl !== 'en') {
          tl = 'en'
        } else {
          tl =
            opt.optionAvailable.tl.find(
              (lang): lang is Language => lang !== 'default' && lang !== tl
            ) || 'en'
        }
      } else {
        tl = opt.dictOption.tl2
      }
    } else if (!opt.from) {
      sl = 'auto'
    }
  }

  return { sl, tl, text }
}
