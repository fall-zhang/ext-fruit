import memoizeOne from 'memoize-one'
import { Caiyun } from '@salad/trans/service-caiyun/index'

import { getTranslator as getBaiduTranslator } from '../baidu/engine'
import type { SearchFunction } from '../../api-common/search-type'
import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'
import { detectLangInfo } from '../../api-common/detect-lang'
import type { AtomGetSrcFunction } from '../../types/atom-type'

export const getTranslator = memoizeOne(() =>
  new Caiyun({ })
)

export const getSrcPage: AtomGetSrcFunction = () => {
  return 'https://fanyi.caiyunapp.com/'
}

export type CaiyunResult = MachineTranslateResult

export const search: SearchFunction<
  CaiyunResult
> = async (rawText, opt) => {
  const translator = getTranslator()
  const langcodes = translator.getSupportLanguages()

  const { from: sl, to: tl, text } = detectLangInfo(
    rawText,
    {
      from: opt.from,
      to: opt.to,
      localLang: opt.localLang,
    }
  )

  const baiduTranslator = getBaiduTranslator()

  // let baiduResult: TranslateResult | undefined

  // try {
  //   // Caiyun's lang detection is broken
  //   baiduResult = await baiduTranslator.translate(text, sl, tl)
  //   if (langcodes.includes(baiduResult.from)) {
  //     sl = baiduResult.from
  //   }
  // } catch (e) {
  //   console.warn('⚡️ line:55 ~ e: ', e)
  // }
  const caiYunToken = opt.dictAuth?.caiyun.token
  const caiYunConfig = caiYunToken ? { token: caiYunToken } : undefined

  try {
    const result = await translator.translate(text, sl, tl, caiYunConfig)
    console.log('⚡️ line:52 ~ result: ', result)
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
          slInitial: opt.profile.caiyun.options.slInitial,
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
