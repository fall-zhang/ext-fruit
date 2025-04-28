import { SearchFunction, GetSrcPageFunction, getChsToChz } from '../helpers'
import { moedictSearch, GuoYuResult } from '../guoyu/engine'

export const getSrcPage: GetSrcPageFunction = async text => {
  const chsToChz = await getChsToChz()
  return `https://www.moedict.tw/~${chsToChz(text)}`
}

export type LiangAnResult = GuoYuResult

export const search: SearchFunction<LiangAnResult> = (
  text,
  config,
  profile,
  payload
) => {
  return moedictSearch<LiangAnResult>(
    'c',
    text,
    config,
    profile.dicts.all.liangan.options
  ).then(res => {
    const result = {
      ...res
    }
    if (res.result.h) {
      result.result.h = res.result.h.map(h => {
        const newH = {
          ...h
        }
        if (newH.p) {
          newH.p = h.p.replace('<br>陸⃝', ' [大陆]: ')
        }
        return newH
      })
    }

    return result
  })
}
