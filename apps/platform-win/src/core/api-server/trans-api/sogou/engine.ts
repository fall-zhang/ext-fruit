import memoizeOne from 'memoize-one'
import { Sogou } from '@salad/trans/service-sogou/index'


import type { SogouLanguage } from './config'
import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'
import { detectLangInfo } from '../../api-common/detect-lang'
import type { config } from 'rxjs'

export const getTranslator = memoizeOne(
  () =>
    new Sogou({
      config:
        import.meta.env.VITE_SOGOU_PID && import.meta.env.SOGOU_KEY
          ? {
            pid: import.meta.env.VITE_SOGOU_PID,
            key: import.meta.env.SOGOU_KEY,
          }
          : undefined,
    })
)

export const getSrcPage: GetSrcPageFunction = (text, langCode, profile) => {
  let lang
  if (profile.sogou.options.tl === 'default') {
    if (langCode === 'zh-CN') {
      lang = 'zh-CHS'
    } else if (langCode === 'zh-TW') {
      lang = 'zh-CHT'
    } else {
      lang = 'en'
    }
  } else {
    lang = profile.sogou.options.tl
  }


  return `https://fanyi.sogou.com/#auto/${lang}/${text}`
}

export type SogouResult = MachineTranslateResult

export const search: SearchFunction<SogouResult> = async (rawText, opt) => {
  if (!opt.dictAuth?.sogou.pid) {
    return machineResult(
      {
        result: {
          requireCredential: true,
          id: 'sogou',
          sl: 'auto',
          tl: 'auto',
          slInitial: 'hide',
          searchText: { paragraphs: [''] },
          trans: { paragraphs: [''] },
        },
      },
      []
    )
  }

  const translator = getTranslator()

  const { from: sl, to: tl, text } = detectLangInfo(
    rawText,
    {
      from: opt.from,
      to: opt.to,
      localLang: opt.localLang,
    }
  )

  const translatorConfig = {
    pid: opt.dictAuth.sogou.pid,
    key: opt.dictAuth.sogou.key,
  }

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    return machineResult(
      {
        result: {
          id: 'sogou',
          sl: result.from,
          tl: result.to,
          slInitial: opt.profile.sogou.options.slInitial,
          searchText: result.origin,
          trans: result.trans,
        },
        audio: {
          py: result.trans.tts,
          us: result.trans.tts,
        },
      },
      translator.getSupportLanguages()
    )
  } catch (e) {
    return machineResult(
      {
        result: {
          id: 'sogou',
          sl,
          tl,
          slInitial: 'hide',
          searchText: { paragraphs: [''] },
          trans: { paragraphs: [''] },
        },
      },
      translator.getSupportLanguages()
    )
  }
}
