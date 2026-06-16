// 每个翻译对应的配置信息
import { v4 as uuid } from 'uuid'
import { getDefaultDictAuths, type DictAuths } from './auth'
import type { ProfileID } from '@/core/api-local/profile'
import type { AllDictsConf, DictID } from '@P/salad-api/src/api-trans'
import { getAllDictsConf } from '@P/salad-api/src/api-trans'


export type Profile = {
  version: number

  id: string

  /** default selected dictionaries */
  selectDict: Array<keyof AllDictsConf>,
  // settings of each dict will be auto-generated
  allDicts: AllDictsConf,
  pronounceDict: {
    zh: DictID[]
    en: DictID[]
    jp: DictID[]
  }
  dictAuth: DictAuths
}
export type AppProfile = Profile

export function getDefaultSelectDict (): Array<DictID> {
  return [
    'bing', // 必应词典 ✅ 默认启用
    'cambridge', // 剑桥词典 ✅  默认启用
    'youdao', // 有道词典 ✅  默认启用
    'cobuild', // 科林斯高阶 ✅ 默认启用
    'vocabulary', // vocabulary ✅ 默认启用（可以爬取更多有用的信息） 默认启用
    // 'baidu', // 百度 ❌ 需要登录
    // 'urban', // urban ❌ 需要代理，且 DOM 已经更新，无法抓取 默认启用
    // 'caiyun', // 彩云 ❌ 需要登录
    // 'youdaotrans', // 有道 ❌ 需要登录
    'zdic', // 汉语词典，不能查英文 ✅ 默认启用
    'guoyu', // 汉语词典，不能查英文 ✅ 默认启用
    'liangan', // 汉语词典，不能查英文 ✅ 默认启用
    // 'googledict', // 当前无法爬取数据，需要更新
    // "google", // 谷歌 API ❌ 需要登录

    'ahdict', // 美国传统词典 ✅
    'oaldict', // 牛津高阶词典 ✅
    // 'cnki', // CNKI 翻译(知网翻译)
    // "etymonline",
    // "eudic",
    // "hjdict",
    // "jikipedia",
    //  "jukuu", "lexico", "longman", "macmillan", "mojidict", "naver", "renren", "sogou", "tencent", "weblio", "weblioejje", "merriamwebster", "websterlearner", "wikipedia"
  ]
}

export function getDefaultProfile (): Profile {
  return {
    version: 1,
    id: uuid(),
    selectDict: getDefaultSelectDict(),
    allDicts: getAllDictsConf(),
    dictAuth: getDefaultDictAuths(),
    pronounceDict: {
      zh: [],
      en: [],
      jp: [],
    },
  }
}


export interface ProfileStorage {
  idItem: ProfileID
  profile: Profile
}
