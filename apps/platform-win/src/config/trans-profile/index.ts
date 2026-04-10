// 每个翻译对应的配置信息
import { v4 as uuid } from 'uuid'
import type { AllDictsConf, DictID } from '@/core/api-server/config'
import { getAllDicts } from '@/core/api-server/config'
import { getDefaultDictAuths, type DictAuths } from './auth'
import type { ProfileID } from '@/core/api-local/profile'


export type ProfileMutable = {
  version: number

  id: string

  dicts: {
    /** default selected dictionaries */
    selected: Array<keyof AllDictsConf>,
    // settings of each dict will be auto-generated
    all: AllDictsConf,
  },
  dictAuth: DictAuths
}
export type Profile = ProfileMutable
export type AppProfile = ProfileMutable

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
    'cnki', // 牛津高阶词典 ✅
    // "etymonline",
    // "eudic",
    // "hjdict",
    // "jikipedia",
    //  "jukuu", "lexico", "longman", "macmillan", "mojidict", "naver", "renren", "sogou", "tencent", "weblio", "weblioejje", "merriamwebster", "websterlearner", "wikipedia"
  ]
}

export function getDefaultProfile (id?: string): Profile {
  return {
    version: 1,

    id: id || uuid(),

    dicts: {
      /** default selected dictionaries */
      selected: getDefaultSelectDict(),
      // settings of each dict will be auto-generated
      all: getAllDicts(),
    },
    dictAuth: getDefaultDictAuths(),
  }
}


export interface ProfileStorage {
  idItem: ProfileID
  profile: Profile
}
