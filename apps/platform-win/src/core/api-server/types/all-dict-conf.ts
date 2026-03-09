import baidu from '../trans-api/baidu/config'
import bing from '../trans-api/bing/config'
import ahdict from '../trans-api/ahdict/config'
import oaldict from '../trans-api/oaldict/config'
import caiyun from '../trans-api/caiyun/config'
import cambridge from '../trans-api/cambridge/config'
import cnki from '../trans-api/cnki/config'
import cobuild from '../trans-api/cobuild/config'
import etymonline from '../trans-api/etymonline/config'
import eudic from '../trans-api/eudic/config'
import google from '../trans-api/google/config'
import googledict from '../trans-api/googledict/config'
import guoyu from '../trans-api/guoyu/config'
import hjdict from '../trans-api/hjdict/config'
import jikipedia from '../trans-api/jikipedia/config'
import jukuu from '../trans-api/jukuu/config'
import lexico from '../trans-api/lexico/config'
import liangan from '../trans-api/liangan/config'
import longman from '../trans-api/longman/config'
import macmillan from '../trans-api/macmillan/config'
import mojidict from '../trans-api/mojidict/config'
import naver from '../trans-api/naver/config'
import renren from '../trans-api/renren/config'
import sogou from '../trans-api/sogou/config'
import tencent from '../trans-api/tencent/config'
import urban from '../trans-api/urban/config'
import vocabulary from '../trans-api/vocabulary/config'
import weblio from '../trans-api/weblio/config'
import weblioejje from '../trans-api/weblioejje/config'
import merriamwebster from '../trans-api/merriamwebster/config'
import websterlearner from '../trans-api/websterlearner/config'
import wikipedia from '../trans-api/wikipedia/config'
import youdao from '../trans-api/youdao/config'
import youdaotrans from '../trans-api/youdaotrans/config'
import zdic from '../trans-api/zdic/config'
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
  zdic: zdic(),
}

export type AllDictsConf = typeof defaultAllDicts

export type DictID = keyof AllDictsConf

export const getAllDicts = (): AllDictsConf => cloneDeep(defaultAllDicts)
