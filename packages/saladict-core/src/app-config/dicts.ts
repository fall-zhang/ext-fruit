// import { SupportedLangs } from '@/_helpers/lang-check'
import { SupportedLangs } from '@P/trans-api/types/api-types'

import baidu from '@P/trans-api/src/baidu/config'
import bing from '@P/trans-api/src/bing/config'
import ahdict from '@P/trans-api/src/ahdict/config'
import oaldict from '@P/trans-api/src/oaldict/config'
import caiyun from '@P/trans-api/src/caiyun/config'
import cambridge from '@P/trans-api/src/cambridge/config'
import cnki from '@P/trans-api/src/cnki/config'
import cobuild from '@P/trans-api/src/cobuild/config'
import etymonline from '@P/trans-api/src/etymonline/config'
import eudic from '@P/trans-api/src/eudic/config'
import google from '@P/trans-api/src/google/config'
import googledict from '@P/trans-api/src/googledict/config'
import guoyu from '@P/trans-api/src/guoyu/config'
import hjdict from '@P/trans-api/src/hjdict/config'
import jikipedia from '@P/trans-api/src/jikipedia/config'
import jukuu from '@P/trans-api/src/jukuu/config'
import lexico from '@P/trans-api/src/lexico/config'
import liangan from '@P/trans-api/src/liangan/config'
import longman from '@P/trans-api/src/longman/config'
import macmillan from '@P/trans-api/src/macmillan/config'
import mojidict from '@P/trans-api/src/mojidict/config'
import naver from '@P/trans-api/src/naver/config'
import renren from '@P/trans-api/src/renren/config'
// import shanbay from '@P/trans-api/src/shanbay/config'
import sogou from '@P/trans-api/src/sogou/config'
import tencent from '@P/trans-api/src/tencent/config'
import urban from '@P/trans-api/src/urban/config'
import vocabulary from '@P/trans-api/src/vocabulary/config'
import weblio from '@P/trans-api/src/weblio/config'
import weblioejje from '@P/trans-api/src/weblioejje/config'
import merriamwebster from '@P/trans-api/src/merriamwebster/config'
import websterlearner from '@P/trans-api/src/websterlearner/config'
import wikipedia from '@P/trans-api/src/wikipedia/config'
import youdao from '@P/trans-api/src/youdao/config'
import youdaotrans from '@P/trans-api/src/youdaotrans/config'
import zdic from '@P/trans-api/src/zdic/config'

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

export const getAllDicts = (): AllDicts =>
  JSON.parse(JSON.stringify(defaultAllDicts))

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
    | { [option: string]: number | boolean | string }
    | undefined = undefined
> = Options extends undefined
  ? DictItemBase
  : DictItemBase & { options: Options }

/** Infer selectable options type */
export type SelectOptions<
  Options extends
    | { [option: string]: number | boolean | string }
    | undefined = undefined,
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
    | { [option: string]: number | boolean | string }
    | undefined = undefined,
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
