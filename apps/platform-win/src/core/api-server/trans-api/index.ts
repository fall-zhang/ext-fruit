import * as baidu from './baidu/engine'
import * as ahdict from './ahdict/engine'
import * as bing from './bing/engine'
import * as caiyun from './caiyun/engine'
import * as cambridge from './cambridge/engine'
import * as cnki from './cnki/engine'
import * as cobuild from './cobuild/engine'
import * as etymonline from './etymonline/engine'
import * as eudic from './eudic/engine'
import * as google from './google/engine'
import * as googledict from './googledict/engine'
import * as guoyu from './guoyu/engine'
import * as hjdict from './hjdict/engine'
import * as jikipedia from './jikipedia/engine'
import * as jukuu from './jukuu/engine'
import * as lexico from './lexico/engine'
import * as liangan from './liangan/engine'
import * as longman from './longman/engine'
import * as macmillan from './macmillan/engine'
import * as merriamwebster from './merriamwebster/engine'
import * as mojidict from './mojidict/engine'
import * as naver from './naver/engine'
import * as oaldict from './oaldict/engine'
import * as renren from './renren/engine'
import * as shanbay from './shanbay/engine'
import * as sogou from './sogou/engine'
import * as tencent from './tencent/engine'
import * as urban from './urban/engine'
import * as vocabulary from './vocabulary/engine'
import * as weblio from './weblio/engine'
import * as weblioejje from './weblioejje/engine'
import * as websterlearner from './websterlearner/engine'
import * as wikipedia from './wikipedia/engine'
import * as youdao from './youdao/engine'
import * as youdaotrans from './youdaotrans/engine'
import * as zdic from './zdic/engine'

export const api = {
  baidu: baidu.search,
  ahdict: ahdict.search,
  bing: bing.search,
  caiyun: caiyun.search,
  cambridge: cambridge.search,
  cnki: cnki.search,
  cobuild: cobuild.search,
  etymonline: etymonline.search,
  eudic: eudic.search,
  google: google.search,
  googledict: googledict.search,
  guoyu: guoyu.search,
  hjdict: hjdict.search,
  jikipedia: jikipedia.search,
  jukuu: jukuu.search,
  lexico: lexico.search,
  liangan: liangan.search,
  longman: longman.search,
  macmillan: macmillan.search,
  merriamwebster: merriamwebster.search,
  mojidict: mojidict.search,
  naver: naver.search,
  oaldict: oaldict.search,
  renren: renren.search,
  shanbay: shanbay.search,
  sogou: sogou.search,
  tencent: tencent.search,
  urban: urban.search,
  vocabulary: vocabulary.search,
  weblio: weblio.search,
  weblioejje: weblioejje.search,
  websterlearner: websterlearner.search,
  wikipedia: wikipedia.search,
  youdao: youdao.search,
  youdaotrans: youdaotrans.search,
  zdic: zdic.search,
}

