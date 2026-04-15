import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import memoizeOne from 'memoize-one'
import { Tencent } from '@salad/trans/service-tencent/index'
import { detectLangInfo } from '../../api-common/detect-lang'
import { getTranslator as getBaiduTranslator } from '../baidu/engine'
import { machineResult } from '../../api-common/result-handle'
import type { TencentResult } from './type'

export const getTranslator = memoizeOne(
  () => new Tencent({})
)

export const getSrcPage: AtomGetSrcFunction = (text, localLang) => {
  let lang
  if (localLang === 'zh-CN') {
    lang = 'zh-CHS'
  } else if (localLang === 'zh-TW') {
    lang = 'zh-CHT'
  } else {
    lang = 'en'
  }
  return `https://fanyi.qq.com/#auto/${lang}/${text}`
}

export const getFetchRequest: AtomFetchRequest<TencentResult> = (text, opt) => {
  const translator = getTranslator()

  const { from: sl, to: tl } = detectLangInfo(
    text,
    {
      from: opt.from,
      to: opt.to,
      localLang: opt.localLang,
    }
  )

  const secretId = opt.dictAuth?.tencent.secretId
  const secretKey = opt.dictAuth?.tencent.secretKey
  const translatorConfig = (secretId && secretKey) ? { secretId, secretKey } : undefined

  if (!translatorConfig) {
    return Promise.resolve(
      machineResult(
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
    )
  }

  return translator.translate(text, sl, tl, translatorConfig).then(async (result) => {
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
          slInitial: opt.profile.tencent.options.slInitial,
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
  }).catch(() => {
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
      []
    )
  })
}

export const handleResponse: AtomResponseHandle<TencentResult> = async (res, _opt) => {
  return res
}
