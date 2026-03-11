import memoizeOne from 'memoize-one'
import { Youdao } from '@salad/trans/service-youdao/index'


import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'
import { detectLangInfo } from '../../api-common/detect-lang'

export const getTranslator = memoizeOne(
  () =>
    new Youdao({})
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


  const appKey = opt.dictAuth?.youdaotrans.appKey
  const key = opt.dictAuth?.youdaotrans.key
  const translatorConfig = appKey && key ? { appKey, key } : undefined

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    return machineResult(
      {
        result: {
          id: 'youdaotrans',
          sl: result.from,
          tl: result.to,
          slInitial: opt.profile.youdaotrans.options.slInitial,
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
