// import baidu from './baidu/config'
import bing from './bing/config'
import ahdict from './ahdict/config'
import oaldict from './oaldict/config'
import caiyun from './caiyun/config'
import cambridge from './cambridge/config'
import cobuild from './cobuild/config'
import etymonline from './etymonline/config'
import eudic from './eudic/config'
import google from './google/config'
import guoyu from './guoyu/config'
import hjdict from './hjdict/config'
import liangan from './liangan/config'
import longman from './longman/config'
import mojidict from './mojidict/config'
import naver from './naver/config'
import renren from './renren/config'
// import sogou from './sogou/config'
// import tencent from './tencent/config'
import urban from './urban/config'
import vocabulary from './vocabulary/config'
import weblio from './weblio/config'
import weblioejje from './weblioejje/config'
import merriamwebster from './merriamwebster/config'
import websterlearner from './websterlearner/config'
import wikipedia from './wikipedia/config'
import youdao from './youdao/config'
import youdaotrans from './youdaotrans/config'
import zdic from './zdic/config'
import shanbay from './shanbay/config'

// @deprecated 已经弃用的翻译 API
// import googledict from './googledict/config'
// import cnki from './cnki/config'
// import jikipedia from './jikipedia/config'
// import jukuu from './jukuu/config'
// import lexico from './lexico/config'
// import macmillan from './macmillan/config'

// For TypeScript to generate typings
// Follow alphabetical order for easy reading
export const defaultAllDicts = {
  // cnki: cnki(),
  // googledict: googledict(),
  // jikipedia: jikipedia(),
  // jukuu: jukuu(),
  // lexico: lexico(),
  // macmillan: macmillan(),
  shanbay: shanbay(),
  // baidu: baidu(),
  bing: bing(),
  ahdict: ahdict(),
  oaldict: oaldict(),
  caiyun: caiyun(),
  cambridge: cambridge(),
  cobuild: cobuild(),
  etymonline: etymonline(),
  eudic: eudic(),
  google: google(),
  guoyu: guoyu(),
  hjdict: hjdict(),
  liangan: liangan(),
  longman: longman(),
  mojidict: mojidict(),
  naver: naver(),
  renren: renren(),
  // sogou: sogou(),
  // tencent: tencent(),
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

export const getAllDictsConf = (): AllDictsConf => structuredClone(defaultAllDicts)
