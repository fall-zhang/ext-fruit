import bing from '@P/salad-api/src/assets/logo/bing.png'
import baidu from '@P/salad-api/src/assets/logo/baidu.png'
import ahdict from '@P/salad-api/src/assets/logo/ahdict.png'
import oaldict from '@P/salad-api/src/assets/logo/oaldict.png'
import caiyun from '@P/salad-api/src/assets/logo/caiyun.png'
import cambridge from '@P/salad-api/src/assets/logo/cambridge.png'
import cnki from '@P/salad-api/src/assets/logo/cnki.png'
import cobuild from '@P/salad-api/src/assets/logo/cobuild.png'
import etymonline from '@P/salad-api/src/assets/logo/etymonline.png'
import eudic from '@P/salad-api/src/assets/logo/eudic.png'
import google from '@P/salad-api/src/assets/logo/google.png'
import googledict from '@P/salad-api/src/assets/logo/googledict.png'
import guoyu from '@P/salad-api/src/assets/logo/guoyu.png'
import hjdict from '@P/salad-api/src/assets/logo/hjdict.png'
import jikipedia from '@P/salad-api/src/assets/logo/jikipedia.png'
import jukuu from '@P/salad-api/src/assets/logo/jukuu.png'
import lexico from '@P/salad-api/src/assets/logo/lexico.png'
import liangan from '@P/salad-api/src/assets/logo/liangan.png'
import longman from '@P/salad-api/src/assets/logo/longman.png'
import macmillan from '@P/salad-api/src/assets/logo/macmillan.png'
import mojidict from '@P/salad-api/src/assets/logo/mojidict.png'
import naver from '@P/salad-api/src/assets/logo/naver.png'
import renren from '@P/salad-api/src/assets/logo/renren.png'
import sogou from '@P/salad-api/src/assets/logo/sogou.png'
import tencent from '@P/salad-api/src/assets/logo/tencent.png'
import urban from '@P/salad-api/src/assets/logo/urban.png'
import vocabulary from '@P/salad-api/src/assets/logo/vocabulary.png'
import weblio from '@P/salad-api/src/assets/logo/weblio.png'
import weblioejje from '@P/salad-api/src/assets/logo/weblioejje.png'
import merriamwebster from '@P/salad-api/src/assets/logo/merriamwebster.png'
import websterlearner from '@P/salad-api/src/assets/logo/websterlearner.png'
import wikipedia from '@P/salad-api/src/assets/logo/wikipedia.png'
import youdao from '@P/salad-api/src/assets/logo/youdao.png'
import youdaotrans from '@P/salad-api/src/assets/logo/youdaotrans.png'
import zdic from '@P/salad-api/src/assets/logo/zdic.png'
import type { DictID } from '@P/salad-api/src/api-trans'
import type { MachineDictID } from '@P/salad-api/src/api-trans-machine/api-config'

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
