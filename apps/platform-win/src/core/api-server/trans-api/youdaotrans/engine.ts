import memoizeOne from 'memoize-one'
import { Youdao } from '@salad/trans/service-youdao/index'


import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'
import { detectLangInfo } from '../../api-common/detect-lang'

export const getTranslator = memoizeOne(
  () =>
    new Youdao({
      config:
        process.env.YOUDAO_APPKEY && process.env.YOUDAO_KEY
          ? {
            appKey: process.env.YOUDAO_APPKEY,
            key: process.env.YOUDAO_KEY,
          }
          : undefined,
    })
)

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  return 'http://fanyi.youdao.com'
}

export type YoudaotransResult = MachineTranslateResult

export const search: SearchFunction<YoudaotransResult> = async (rawText, opt) => {
  const translator = getTranslator()

  const { from: sl, to: tl, text } = detectLangInfo(
    rawText,
    {
      from: opt.from,
      to: opt.to,
      localLang: opt.localLang,
    }
  )


  const appKey = config.dictAuth.youdaotrans.appKey
  const key = config.dictAuth.youdaotrans.key
  const translatorConfig = appKey && key ? { appKey, key } : undefined

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    return machineResult(
      {
        result: {
          id: 'youdaotrans',
          sl: result.from,
          tl: result.to,
          slInitial: profile.dicts.all.youdaotrans.options.slInitial,
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
          id: 'youdaotrans',
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
