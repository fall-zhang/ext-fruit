import memoizeOne from 'memoize-one'
import { Baidu } from '@sala/trans/service-baidu'


import type { BaiduLanguage } from './config'
import { machineResult, type MachineTranslatePayload, type MachineTranslateResult } from '@P/saladict-core/src/components/MachineTrans/engine'
import type { GetSrcPageFunction, SearchFunction } from '../types'

export const getTranslator = memoizeOne(
  () =>
    new Baidu({
      config:
        process.env.BAIDU_APPID && process.env.BAIDU_KEY
          ? {
            appid: process.env.BAIDU_APPID,
            key: process.env.BAIDU_KEY,
          }
          : undefined,
    })
)

export const getSrcPage: GetSrcPageFunction = (text, config, dictProfile) => {
  let lang
  if (dictProfile.baidu.options.tl === 'default') {
    if (config.langCode === 'zh-CN') {
      lang = 'zh'
    } else if (config.langCode === 'zh-TW') {
      lang = 'cht'
    } else {
      lang = 'en'
    }
  } else {
    lang = dictProfile.baidu.options.tl
  }

  // const lang =
  //   dictProfile.baidu.options.tl === 'default'
  //     ? config.langCode === 'zh-CN'
  //       ? 'zh'
  //       : config.langCode === 'zh-TW'
  //         ? 'cht'
  //         : 'en'
  //     : dictProfile.baidu.options.tl

  return `https://fanyi.baidu.com/#auto/${lang}/${text}`
}

export type BaiduResult = MachineTranslateResult<'baidu'>

export const search: SearchFunction<
  BaiduResult,
  MachineTranslatePayload<BaiduLanguage>
> = async (rawText, config, allDictProfile, payload) => {
  const translator = getTranslator()

  const { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    allDictProfile.baidu,
    config,
    payload
  )

  const appid = config.dictAuth.baidu.appid
  const key = config.dictAuth.baidu.key
  const translatorConfig = appid && key ? { appid, key } : undefined

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    return machineResult(
      {
        result: {
          id: 'baidu',
          slInitial: allDictProfile.baidu.options.slInitial,
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
      translator.getSupportLanguages()
    )
  }
}
