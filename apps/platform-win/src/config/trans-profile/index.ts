// 每个翻译对应的配置信息
import { v4 as uuid } from 'uuid'
import type { AllDictsConf, DictID } from '@/core/api-server/config'
import { getAllDicts } from '@/core/api-server/config'
import { getDefaultDictAuths, type DictAuths } from './auth'
import { getDefaultProfileID, type ProfileID } from '@/core/api-local/profile'


export type MtaAutoUnfold = '' | 'once' | 'always' | 'popup' | 'hide'

export type ProfileMutable = {
  version: number

  id: string

  /** auto unfold multiline textarea search box */
  mtaAutoUnfold: MtaAutoUnfold,

  /** show waveform control panel */
  waveform: boolean,

  /** remember user manual dict folding on the same page */
  stickyFold: boolean,

  dicts: {
    /** default selected dictionaries */
    selected: Array<keyof AllDictsConf>,
    // settings of each dict will be auto-generated
    all: AllDictsConf,
  },
  dictAuth: DictAuths
}
export type Profile = ProfileMutable

export function getDefaultSelectDict (): Array<DictID> {
  return [
    // 'cobuild', // 科林斯高阶 ✅ 默认启用
    // 'cambridge', // 剑桥词典 ✅  默认启用
    // 'youdao', // 有道词典 ✅  默认启用
    // 'vocabulary', // vocabulary ✅ 默认启用（可以爬取更多有用的信息） 默认启用
    // 'baidu', // 百度 ❌ 需要登录
    // 'urban', // urban ❌ 需要代理，且 DOM 已经更新，无法抓取 默认启用
    // 'caiyun', // 彩云 ❌ 需要登录
    // 'youdaotrans', // 有道 ❌ 需要登录
    // 'zdic', // 汉语词典，不能查英文 ✅ 默认启用
    // 'guoyu', // 汉语词典，不能查英文 ✅ 默认启用
    // 'liangan', // 汉语词典，不能查英文 ✅ 默认启用
    // 'googledict', // 当前无法爬取数据，需要更新
    // "google", // 谷歌 API ❌ 需要登录

    // 'ahdict', // 美国传统词典 ✅
    // 'oaldict', // 牛津高阶词典 ✅
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

    /** auto unfold multiline textarea search box */
    mtaAutoUnfold: '' as MtaAutoUnfold,

    /** show waveform control panel */
    waveform: true,

    /** remember user manual dict folding on the same page */
    stickyFold: false,

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

export function genProfilesStorage (): {
  profileIDList: ProfileID[]
  profiles: Profile[]
} {
  const defaultID = getDefaultProfileID()
  const defaultProfile = getDefaultProfile(defaultID.id)
  const sentenceStorage = sentence()
  const translationStorage = translation()
  const scholarStorage = scholar()
  const nihongoStorage = nihongo()

  return {
    profileIDList: [
      defaultID,
      sentenceStorage.idItem,
      translationStorage.idItem,
      scholarStorage.idItem,
      nihongoStorage.idItem,
    ],
    profiles: [
      defaultProfile,
      sentenceStorage.profile,
      translationStorage.profile,
      scholarStorage.profile,
      nihongoStorage.profile,
    ],
  }
}

export function sentence (): ProfileStorage {
  const idItem = getDefaultProfileID()
  idItem.name = '%%_sentence_%%'

  const profile = getDefaultProfile(idItem.id) as ProfileMutable
  profile.dicts.selected = [
    'jukuu',
    'bing',
    'cnki',
    'renren',
    'eudic',
    'cobuild',
    'cambridge',
    'longman',
    'macmillan',
  ]

  const allDict = profile.dicts.all
  allDict.bing.options.tense = false
  allDict.bing.options.phsym = false
  allDict.bing.options.cdef = false
  allDict.bing.options.related = false
  allDict.bing.options.sentence = 9999
  allDict.cnki.options.dict = false
  allDict.eudic.options.resultCount = 9999
  allDict.macmillan.options.related = false
  allDict.longman.options.wordfams = false
  allDict.longman.options.collocations = false
  allDict.longman.options.grammar = false
  allDict.longman.options.thesaurus = false
  allDict.longman.options.examples = true
  allDict.longman.options.bussinessFirst = false
  allDict.longman.options.related = false

  return { idItem, profile }
}

export function scholar (): ProfileStorage {
  const idItem = getDefaultProfileID()
  idItem.name = '%%_scholar_%%'

  const profile = getDefaultProfile(idItem.id) as ProfileMutable
  profile.dicts.selected = [
    'googledict',
    'cambridge',
    'cobuild',
    'etymonline',
    'cnki',
    'macmillan',
    'lexico',
    'websterlearner',
    'google',
    'youdaotrans',
    'zdic',
    'guoyu',
    'liangan',
  ]

  const allDict = profile.dicts.all
  allDict.macmillan.defaultUnfold = {
    matchAll: false,
    english: false,
    chinese: false,
    japanese: false,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
    others: false,
  }
  allDict.lexico.defaultUnfold = {
    matchAll: false,
    english: false,
    chinese: false,
    japanese: false,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
    others: false,
  }
  allDict.websterlearner.defaultUnfold = {
    matchAll: false,
    english: false,
    chinese: false,
    japanese: false,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
    others: false,
  }
  allDict.google.selectionWC.min = 5
  allDict.youdaotrans.selectionWC.min = 5

  return { idItem, profile }
}

export function translation (): ProfileStorage {
  const idItem = getDefaultProfileID()
  idItem.name = '%%_translation_%%'

  const profile = getDefaultProfile(idItem.id) as ProfileMutable
  profile.dicts.selected = [
    'google',
    'tencent',
    'baidu',
    'caiyun',
    'youdaotrans',
    'zdic',
    'guoyu',
    'liangan',
  ]
  profile.mtaAutoUnfold = 'always'

  return { idItem, profile }
}

export function nihongo (): ProfileStorage {
  const idItem = getDefaultProfileID()
  idItem.name = '%%_nihongo_%%'

  const profile = getDefaultProfile(idItem.id) as ProfileMutable
  profile.dicts.selected = [
    'mojidict',
    'hjdict',
    'weblioejje',
    'weblio',
    'google',
    'tencent',
    'caiyun',
    'googledict',
    'wikipedia',
  ]
  profile.dicts.all.wikipedia.options.lang = 'ja'
  profile.waveform = false

  return { idItem, profile }
}
