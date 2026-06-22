import memoizeOne from 'memoize-one'

import { Baidu, Caiyun } from '@P/open-trans'
import type { Language } from '@P/open-trans/languages'
import type { AuthBody } from './config'

export const getTranslator = memoizeOne(() =>
  new Caiyun({ })
)
// export const getBaiduTranslator = memoizeOne(() =>
//   new Baidu({ })
// )

export const search = async (rawText: string, opt: {
  from?: Language
  to?: Language
  option?: AuthBody
}) => {
  const translator = getTranslator()
  // const langcodes = translator.getSupportLanguages()

  const from = opt.from
  const to = opt.to

  // const baiduTranslator = getBaiduTranslator()

  // const caiYunToken = opt.dictAuth?.caiyun.token
  const caiYunToken = ''
  const caiYunConfig = caiYunToken ? { token: caiYunToken } : undefined

  try {
    const result = await translator.translate(rawText, from, to, caiYunConfig)
    // result.origin.tts = await baiduTranslator.textToSpeech(
    //   result.origin.paragraphs.join('\n'),
    //   result.from
    // )
    // result.trans.tts = await baiduTranslator.textToSpeech(
    //   result.trans.paragraphs.join('\n'),
    //   result.to
    // )
    return {
      result: {
        id: 'caiyun',
        sl: result.from,
        tl: result.to,
        slInitial: opt.option,
        searchText: result.origin,
        trans: result.trans,
      },
      audio: {
        py: result.trans.tts,
        us: result.trans.tts,
      },
    }
  } catch (e) {
    return {
      result: {
        id: 'caiyun',
        sl: from,
        tl: to,
        slInitial: 'hide',
        searchText: { paragraphs: [''] },
        trans: { paragraphs: [''] },
      },
    }
  }
}
