// import { SupportedLangs } from '@/_helpers/lang-check'
// import { SupportedLangs } from '@P/trans-api/types/api-types'
import type { SupportedLangs } from '../utils/lang-check'

import baidu from '@P/saladict-core/src/core/trans-api/baidu/config'
import bing from '@P/saladict-core/src/core/trans-api/bing/config'
import ahdict from '@P/saladict-core/src/core/trans-api/ahdict/config'
import oaldict from '@P/saladict-core/src/core/trans-api/oaldict/config'
import caiyun from '@P/saladict-core/src/core/trans-api/caiyun/config'
import cambridge from '@P/saladict-core/src/core/trans-api/cambridge/config'
import cnki from '@P/saladict-core/src/core/trans-api/cnki/config'
import cobuild from '@P/saladict-core/src/core/trans-api/cobuild/config'
import etymonline from '@P/saladict-core/src/core/trans-api/etymonline/config'
import eudic from '@P/saladict-core/src/core/trans-api/eudic/config'
import google from '@P/saladict-core/src/core/trans-api/google/config'
import googledict from '@P/saladict-core/src/core/trans-api/googledict/config'
import guoyu from '@P/saladict-core/src/core/trans-api/guoyu/config'
import hjdict from '@P/saladict-core/src/core/trans-api/hjdict/config'
import jikipedia from '@P/saladict-core/src/core/trans-api/jikipedia/config'
import jukuu from '@P/saladict-core/src/core/trans-api/jukuu/config'
import lexico from '@P/saladict-core/src/core/trans-api/lexico/config'
import liangan from '@P/saladict-core/src/core/trans-api/liangan/config'
import longman from '@P/saladict-core/src/core/trans-api/longman/config'
import macmillan from '@P/saladict-core/src/core/trans-api/macmillan/config'
import mojidict from '@P/saladict-core/src/core/trans-api/mojidict/config'
import naver from '@P/saladict-core/src/core/trans-api/naver/config'
import renren from '@P/saladict-core/src/core/trans-api/renren/config'
// import shanbay from '@P/saladict-core/src/core/trans-api/shanbay/config'
import sogou from '@P/saladict-core/src/core/trans-api/sogou/config'
import tencent from '@P/saladict-core/src/core/trans-api/tencent/config'
import urban from '@P/saladict-core/src/core/trans-api/urban/config'
import vocabulary from '@P/saladict-core/src/core/trans-api/vocabulary/config'
import weblio from '@P/saladict-core/src/core/trans-api/weblio/config'
import weblioejje from '@P/saladict-core/src/core/trans-api/weblioejje/config'
import merriamwebster from '@P/saladict-core/src/core/trans-api/merriamwebster/config'
import websterlearner from '@P/saladict-core/src/core/trans-api/websterlearner/config'
import wikipedia from '@P/saladict-core/src/core/trans-api/wikipedia/config'
import youdao from '@P/saladict-core/src/core/trans-api/youdao/config'
import youdaotrans from '@P/saladict-core/src/core/trans-api/youdaotrans/config'
import zdic from '@P/saladict-core/src/core/trans-api/zdic/config'
import { cloneDeep } from 'es-toolkit'

// For TypeScript to generate typings
// Follow alphabetical order for easy reading
export const defaultAllDicts = {
  baidu: baidu(),
  bing: bing(),
  ahdict: ahdict(),
  oaldict: oaldict(),
  caiyun: caiyun(),
  cambridge: cambridge(),
  cnki: cnki(),
  cobuild: cobuild(),
  etymonline: etymonline(),
  eudic: eudic(),
  google: google(),
  googledict: googledict(),
  guoyu: guoyu(),
  hjdict: hjdict(),
  jikipedia: jikipedia(),
  jukuu: jukuu(),
  lexico: lexico(),
  liangan: liangan(),
  longman: longman(),
  macmillan: macmillan(),
  mojidict: mojidict(),
  naver: naver(),
  renren: renren(),
  // shanbay: shanbay(),
  sogou: sogou(),
  tencent: tencent(),
  urban: urban(),
  vocabulary: vocabulary(),
  weblio: weblio(),
  weblioejje: weblioejje(),
  merriamwebster: merriamwebster(),
  websterlearner: websterlearner(),
  wikipedia: wikipedia(),
  youdao: youdao(),
  youdaotrans: youdaotrans(),
  zdic: zdic()
}

export type AllDicts = typeof defaultAllDicts

export const getAllDicts = (): AllDicts => cloneDeep(defaultAllDicts)

interface DictItemBase {
  /**
   * Supported language: en, zh-CN, zh-TW, ja, kor, fr, de, es
   * `1` for supported
   */
  lang: string
  /** Show this dictionary when selection contains words in the chosen languages. */
  selectionLang: SupportedLangs
  /**
   * If set to true, the dict start searching automatically.
   * Otherwise it'll only start seaching when user clicks the unfold button.
   * Default MUST be true and let user decide.
   */
  defaultUnfold: SupportedLangs
  /**
   * This is the default height when the dict first renders the result.
   * If the content height is greater than the preferred height,
   * the preferred height is used and a mask with a view-more button is shown.
   * Otherwise the content height is used.
   */
  selectionWC: {
    min: number
    max: number
  }
  /** Word count to start searching */
  preferredHeight: number
}

/**
 * Optional dict custom options. Can only be boolean, number or string.
 * For string, add additional `options_sel` field to list out choices.
 */
type DictItemWithOptions<
  Options extends
    | { [option: string]: number | boolean | string } |
    undefined = undefined
> = Options extends undefined
  ? DictItemBase
  : DictItemBase & { options: Options }

/** Infer selectable options type */
export type SelectOptions<
  Options extends
    | { [option: string]: number | boolean | string } |
    undefined = undefined,
  Key extends keyof Options = Options extends undefined ? never : keyof Options
> = {
  [opt in Key extends any
    ? Options[Key] extends string
      ? Key
      : never
    : never]: Options[opt][]
}

/**
 * If an option is of `string` type there will be an array
 * of options in `options_sel` field.
 */
export type DictItem<
  Options extends
    | { [option: string]: number | boolean | string } |
    undefined = undefined,
  Key extends keyof Options = Options extends undefined ? never : keyof Options
> = Options extends undefined
  ? DictItemWithOptions
  : DictItemWithOptions<Options> &
      ((Key extends any
        ? Options[Key] extends string
          ? Key
          : never
        : never) extends never
        ? Record<string, unknown>
        : {
          options_sel: SelectOptions<Options, Key>
        })
