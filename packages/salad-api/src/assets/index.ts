import bing from './logo/bing.png'
import baidu from './logo/baidu.png'
import ahdict from './logo/ahdict.png'
import oaldict from './logo/oaldict.png'
import caiyun from './logo/caiyun.png'
import cambridge from './logo/cambridge.png'
import cnki from './logo/cnki.png'
import cobuild from './logo/cobuild.png'
import etymonline from './logo/etymonline.png'
import eudic from './logo/eudic.png'
import google from './logo/google.png'
import googledict from './logo/googledict.png'
import guoyu from './logo/guoyu.png'
import hjdict from './logo/hjdict.png'
import jikipedia from './logo/jikipedia.png'
import jukuu from './logo/jukuu.png'
import lexico from './logo/lexico.png'
import liangan from './logo/liangan.png'
import longman from './logo/longman.png'
import macmillan from './logo/macmillan.png'
import mojidict from './logo/mojidict.png'
import naver from './logo/naver.png'
import renren from './logo/renren.png'
import sogou from './logo/sogou.png'
import tencent from './logo/tencent.png'
import urban from './logo/urban.png'
import vocabulary from './logo/vocabulary.png'
import weblio from './logo/weblio.png'
import weblioejje from './logo/weblioejje.png'
import merriamwebster from './logo/merriamwebster.png'
import websterlearner from './logo/websterlearner.png'
import wikipedia from './logo/wikipedia.png'
import youdao from './logo/youdao.png'
import youdaotrans from './logo/youdaotrans.png'
import zdic from './logo/zdic.png'
import type { DictID } from '../api-trans'
import type { MachineDictID } from '../api-trans-machine/api-config'

export const dictImage: Record<DictID | MachineDictID, string> = {
  bing,
  baidu,
  ahdict,
  oaldict,
  caiyun,
  cambridge,
  cobuild,
  etymonline,
  eudic,
  google,
  guoyu,
  hjdict,
  liangan,
  longman,
  mojidict,
  naver,
  renren,
  sogou,
  tencent,
  urban,
  vocabulary,
  weblio,
  weblioejje,
  merriamwebster,
  websterlearner,
  wikipedia,
  youdao,
  youdaotrans,
  zdic,
  // cnki,
  // jikipedia,
  // jukuu,
  // lexico,
  // macmillan,
  // googledict,
}
