import type { GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'
import { moedictSearch } from '../guoyu/engine'
import type { GuoYuResult } from '../guoyu/type'

export const getSrcPage: GetSrcPageFunction = async text => {
  return 'https://www.moedict.tw/~'
}

export type LiangAnResult = GuoYuResult

export const search: SearchFunction<LiangAnResult> = (
  text,
  opt
) => {
  return moedictSearch<LiangAnResult>(
    'c',
    text,
    opt.profile.liangan.options
  ).then(result => {
    if (result.result.h) {
      result.result.h.forEach(h => {
        if (h.p) {
          h.p = h.p.replace('<br>陸⃝', ' [大陆]: ')
        }
      })
    }
    return result
  })
}
