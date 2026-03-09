import memoizeOne from 'memoize-one'
import { Baidu } from '@salad/trans/service-baidu/index'


import type { BaiduLanguage } from './config'
import type { SearchFunction } from '../../types'
import { getMTArgs, type MachineTranslatePayload } from '@P/api-server/get-trans-info'
import { auth } from './auth'
import { machineResult, type MachineTranslateResult } from '@P/api-server/api-common/result-handle'
export const getTranslator = memoizeOne(() =>
  new Baidu({
    config: auth,
  })
)

export type BaiduResult = MachineTranslateResult

export const search: SearchFunction<
  BaiduResult,
  MachineTranslatePayload<BaiduLanguage>
> = async (rawText, opt) => {
  // config, allDictProfile, payload
  const translator = getTranslator()

  const { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    {
      from: opt.payload.sl,
      to: opt.payload.tl,
      localeLang: opt.config.langCode,
      dictOption: opt.profile.baidu.options,
      optionAvailable: opt.profile.baidu.optionalVal,
    }
    // payload
  )

  const appid = opt.config.dictAuth.baidu.appid
  const key = opt.config.dictAuth.baidu.key
  const translatorConfig = appid && key ? { appid, key } : undefined

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    return machineResult(
      {
        result: {
          id: 'baidu',
          slInitial: opt.profile.baidu.options.slInitial,
          sl: result.from,
          tl: result.to,
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
          id: 'baidu',
          slInitial: 'hide',
          sl,
          tl,
          searchText: { paragraphs: [''] },
          trans: { paragraphs: [''] },
        },
      },
      [...Baidu.langMap.keys()]
    )
  }
}
