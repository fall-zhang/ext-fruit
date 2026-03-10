import memoizeOne from 'memoize-one'
import { Sogou } from '@salad/trans/service-sogou/index'


import type { SogouLanguage } from './config'
import { type MachineTranslatePayload, getMTArgs } from '../../api-common/get-trans-info'
import type { MachineTranslateResult, machineResult } from '../../api-common/result-handle'
import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'

export const getTranslator = memoizeOne(
  () =>
    new Sogou({
      config:
        process.env.SOGOU_PID && process.env.SOGOU_KEY
          ? {
            pid: process.env.SOGOU_PID,
            key: process.env.SOGOU_KEY,
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

export const search: SearchFunction<
  SogouResult,
  MachineTranslatePayload<SogouLanguage>
> = async (rawText, opt) => {
  if (!config.dictAuth.sogou.pid) {
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

  const { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    profile.dicts.all.sogou,
    config,
    payload
  )

  const translatorConfig = {
    pid: config.dictAuth.sogou.pid,
    key: config.dictAuth.sogou.key,
  }

  try {
    const result = await translator.translate(text, sl, tl, translatorConfig)
    return machineResult(
      {
        result: {
          id: 'sogou',
          sl: result.from,
          tl: result.to,
          slInitial: profile.dicts.all.sogou.options.slInitial,
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
