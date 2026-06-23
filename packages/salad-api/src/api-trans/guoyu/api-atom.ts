import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GuoYuResult } from './type'
import type { WordResponse } from '../../types/res-type'
import { chsToChz, chzToChs } from '../../utils/chs-to-chz'
import { handleNetWorkError } from '../../utils/error-response'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.moedict.tw/${chsToChz(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const chz = chsToChz(text.replace(/\s+/g, ''))
  // console.log('⚡️ line:13 ~ chz: ', chz)
  const url = `https://www.moedict.tw/a/${encodeURIComponent(chz)}.json`
  return new Request(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const data = await res.json().catch(handleNetWorkError) as GuoYuResult
  const result: WordResponse = {
    engin: 'guoyu',
    type: 'word-trans',
    from,
    to,
    text,
    translate: [],
    pronounce: [],
  }
  if (!data || !data.h) {
    throw new Error('NO_RESULT')
  }
  if (data.h) {
    for (const item of data.h) {
      if (item.p) {
        result.pronounce = [{
          lang: 'zh-CN',
          src: '',
          phoneticSymbols: item.p,
        }]
      }
      if (item.d) {
        for (const item2 of item.d) {
          result.translate.push({
            translate: to === 'zh-CN' ? chzToChs(item2.f) : item2.f,
          })
          if (item2.e) {
            const transText = item2.e.join('\n')
            result.translate.push({
              translate: to === 'zh-CN' ? chzToChs (transText) : transText,
            })
          }
        }
      }
      // if (item.b) {
      //   result.pronounce = [{
      //     lang: 'zh-CN',
      //     src: '',
      //     phoneticSymbols: data.t,
      //   }]
      // }
    }
  }
  return result
}
