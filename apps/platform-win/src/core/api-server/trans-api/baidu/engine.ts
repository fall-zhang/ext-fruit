import memoizeOne from 'memoize-one'
import { Baidu } from '@salad/trans/service-baidu/index'

import { auth } from './auth'
import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'
import type { SearchFunction } from '../../api-common/search-type'
import { detectLangInfo } from '../../api-common/detect-lang'
export const getTranslator = memoizeOne(() =>
  new Baidu({
    config: auth,
  })
)

export type BaiduResult = MachineTranslateResult

export const search: SearchFunction<
  BaiduResult
> = async (rawText, opt) => {
  // config, allDictProfile, payload
  const translator = getTranslator()

  const { from: sl, to: tl, text } = detectLangInfo(rawText, {
    from: opt.from,
    to: opt.to,
    localLang: opt.localLang,
  })

  const appid = opt.dictAuth.baidu.appid
  const key = opt.dictAuth.baidu.key
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
