import type { DictID } from './api-trans'
import type { SupportLanguage } from './const/languages'
import type { AtomFetchRequest, AtomResponseHandle } from './types/atom-type'


export const getRecommendApi = (): Array<DictID> => {
  return [
    'bing', // 必应词典 ✅ 默认启用
    'cambridge', // 剑桥词典 ✅  默认启用
    'youdao', // 有道词典 ✅  默认启用
    'cobuild', // 科林斯高阶 ✅ 默认启用
    'vocabulary', // vocabulary ✅ 默认启用（可以爬取更多有用的信息） 默认启用
    'zdic', // 汉语词典，不能查英文 ✅ 默认启用
    'guoyu', // 汉语词典，不能查英文 ✅ 默认启用
    'liangan', // 汉语词典，不能查英文 ✅ 默认启用
    'ahdict', // 美国传统词典 ✅
    'oaldict', // 牛津高阶词典 ✅
  ]
}

export type {
  SupportLanguage,
  AtomFetchRequest,
  AtomResponseHandle
}

// Woman, can't live with them, can't live without them.
