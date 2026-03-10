import memoizeOne from 'memoize-one'
import { Tencent } from '@salad/trans/service-tencent/index'

import { getTranslator as getBaiduTranslator } from '../baidu/engine'
import type { TencentLanguage } from './config'
import { type MachineTranslatePayload, getMTArgs } from '../../api-common/get-trans-info'
import type { MachineTranslateResult, machineResult } from '../../api-common/result-handle'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'

export const getTranslator = memoizeOne(
  () =>
    new Tencent({
      config:
        process.env.TENCENT_SECRETID && process.env.TENCENT_SECRETKEY
          ? {
            secretId: process.env.TENCENT_SECRETID,
            secretKey: process.env.TENCENT_SECRETKEY,
          }
          : undefined,
    })
)

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  let lang
  if (profile.tencent.options.tl === 'default') {
    if (config.langCode === 'zh-CN') {
      lang = 'zh-CHS'
    } else if (config.langCode === 'zh-TW') {
      lang = 'zh-CHT'
    } else {
      lang = 'en'
    }
  } else {
    lang = profile.tencent.options.tl
  }

  return `https://fanyi.qq.com/#auto/${lang}/${text}`
}

export type TencentResult = MachineTranslateResult

export const search: SearchFunction<
  TencentResult,
  MachineTranslatePayload<TencentLanguage>
> = async (rawText, opt) => {
  const translator = getTranslator()

  const { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    opt.profile.tencent,
    opt.config,
    opt.payload
  )

  const secretId = config.dictAuth.tencent.secretId
  const secretKey = config.dictAuth.tencent.secretKey
  const translatorConfig =
    secretId && secretKey ? { secretId, secretKey } : undefined

  if (!translatorConfig) {
    return machineResult(
      {
        result: {
          requireCredential: true,
          id: 'tencent',
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

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    // Tencent needs extra api credits for TTS which does
    // not fit in the current Saladict architecture.
    // Use Baidu instead.
    const baidu = getBaiduTranslator()
    result.origin.tts = await baidu.textToSpeech(
      result.origin.paragraphs.join('\n'),
      result.from
    )
    result.trans.tts = await baidu.textToSpeech(
      result.trans.paragraphs.join('\n'),
      result.to
    )

    return machineResult(
      {
        result: {
          id: 'tencent',
          sl: result.from,
          tl: result.to,
          slInitial: profile.tencent.options.slInitial,
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
          id: 'tencent',
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
