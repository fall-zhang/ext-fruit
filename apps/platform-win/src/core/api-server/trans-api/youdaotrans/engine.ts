import memoizeOne from 'memoize-one'
import { Youdao } from '@salad/trans/service-youdao/index'


import type { YoudaotransLanguage } from './config'
import { type MachineTranslatePayload, getMTArgs } from '../../api-common/get-trans-info'
import type { MachineTranslateResult, machineResult } from '../../api-common/result-handle'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'

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

export const search: SearchFunction<
  YoudaotransResult,
  MachineTranslatePayload<YoudaotransLanguage>
> = async (rawText, opt) => {
  const translator = getTranslator()

  const { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    profile.dicts.all.youdaotrans,
    config,
    payload
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
