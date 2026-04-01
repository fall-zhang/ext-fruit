import type { AtomGetSrcFunction } from '@P/salad-api/src/types/atom-type'
import { moedictSearch } from '../guoyu/engine'
import type { GuoYuResult } from '../guoyu/type'
import type { SearchFunction } from '@/core/api-server/api-common/search-type';

export const getSrcPage: AtomGetSrcFunction = async text => {
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
      result.result.h.forEach(item => {
        if (item.p) {
          // eslint-disable-next-line no-param-reassign
          item.p = item.p.replace('<br>陸⃝', ' [大陆]: ')
        }
      })
    }
    return result
  })
}
