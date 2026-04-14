import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { detectLangInfo } from '../../api-common/detect-lang'
import { Youdao } from '@salad/trans/service-youdao/index'
import { machineResult } from '../../api-common/result-handle'
import type { YoudaoTransResult } from './type'

export const getSrcPage: AtomGetSrcFunction = () => {
  return 'http://fanyi.youdao.com'
}

export const getFetchRequest: AtomFetchRequest = async (text, opt) => {
  const translator = new Youdao({})

  const { from: sl, to: tl } = detectLangInfo(text, {
    from: opt.from,
    to: opt.to,
    localLang: opt.localLang,
  })

  const appKey = opt.dictAuth?.youdaotrans?.appKey
  const key = opt.dictAuth?.youdaotrans?.key
  const translatorConfig = appKey && key ? { appKey, key } : undefined

  const result = await translator.translate(text, sl, tl, translatorConfig)

  return machineResult(
    {
      result: {
        id: 'youdaotrans',
        sl: result.from,
        tl: result.to,
        slInitial: opt.profile.youdaotrans.options.slInitial,
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
}

export const handleResponse: AtomResponseHandle<YoudaoTransResult> = async (res) => {
  return res
}
