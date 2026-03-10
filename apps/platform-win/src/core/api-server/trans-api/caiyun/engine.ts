import memoizeOne from 'memoize-one'
import { Caiyun } from '@salad/trans/service-caiyun/index'
import type { TranslateResult } from '@salad/trans/translator/index'

import { getTranslator as getBaiduTranslator } from '../baidu/engine'
import type { CaiyunLanguage } from './config'
import { getMTArgs, type MachineTranslatePayload } from '../../api-common/get-trans-info'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'
import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'

export const getTranslator = memoizeOne(
  () =>
    new Caiyun({
      config: process.env.CAIYUN_TOKEN
        ? {
          token: process.env.CAIYUN_TOKEN,
        }
        : undefined,
    })
)

export const getSrcPage: GetSrcPageFunction = () => {
  return 'https://fanyi.caiyunapp.com/'
}

export type CaiyunResult = MachineTranslateResult

export const search: SearchFunction<
  CaiyunResult,
  MachineTranslatePayload<CaiyunLanguage>
> = async (rawText, opt) => {
  const translator = getTranslator()
  const langcodes = translator.getSupportLanguages()

  let { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    {
      from: opt.payload.sl,
      to: opt.payload.tl,
      dictOption: opt.profile.caiyun.options,
      optionalVal: opt.profile.caiyun.optionalVal,
      localeLang: opt.config.langCode,
    }
  )

  const baiduTranslator = getBaiduTranslator()

  let baiduResult: TranslateResult | undefined

  try {
    // Caiyun's lang detection is broken
    baiduResult = await baiduTranslator.translate(text, sl, tl)
    if (langcodes.includes(baiduResult.from)) {
      sl = baiduResult.from
    }
  } catch (e) {
    console.warn('⚡️ line:55 ~ e: ', e)
  }

  const caiYunToken = config.dictAuth.caiyun.token
  const caiYunConfig = caiYunToken ? { token: caiYunToken } : undefined

  try {
    const result = await translator.translate(text, sl, tl, caiYunConfig)
    result.origin.tts = await baiduTranslator.textToSpeech(
      result.origin.paragraphs.join('\n'),
      result.from
    )
    result.trans.tts = await baiduTranslator.textToSpeech(
      result.trans.paragraphs.join('\n'),
      result.to
    )
    return machineResult(
      {
        result: {
          id: 'caiyun',
          sl: result.from,
          tl: result.to,
          slInitial: profile.dicts.all.caiyun.options.slInitial,
          searchText: result.origin,
          trans: result.trans,
        },
        audio: {
          py: result.trans.tts,
          us: result.trans.tts,
        },
      },
      langcodes
    )
  } catch (e) {
    return machineResult(
      {
        result: {
          id: 'caiyun',
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
