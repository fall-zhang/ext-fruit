import bing from './bing/View'
import ahdict from './ahdict/View'
import oaldict from './oaldict/View'
import cambridge from './cambridge/View'
import cnki from './cnki/View'
import cobuild from './cobuild/View'
import etymonline from './etymonline/View'
import eudic from './eudic/View'
import googledict from './googledict/View'
import guoyu from './guoyu/View'
import hjdict from './hjdict/View'
import jikipedia from './jikipedia/View'
import jukuu from './jukuu/View'
import lexico from './lexico/View'
import liangan from './liangan/View'
import longman from './longman/View'
import macmillan from './macmillan/View'
import merriamwebster from './merriamwebster/View'
import naver from './naver/View'
import renren from './renren/View'
import urban from './urban/View'
import vocabulary from './vocabulary/View'
import weblio from './weblio/View'
import weblioejje from './weblioejje/View'
import websterlearner from './websterlearner/View'
import wikipedia from './wikipedia/View'
import youdao from './youdao/View'
import zdic from './zdic/View'
import type { DictID } from '@/core/api-server/types'
import type { FC } from 'react'
import type { ViewProps } from './type'
import DefaultView from './default/View'

const CompMap: Record<DictID, FC<ViewProps<any>>> = {
  bing,
  ahdict,
  oaldict,
  cambridge,
  cnki,
  cobuild,
  etymonline,
  eudic,
  googledict,
  guoyu,
  hjdict,
  jikipedia,
  jukuu,
  lexico,
  liangan,
  longman,
  macmillan,
  naver,
  renren,
  urban,
  vocabulary,
  weblio,
  weblioejje,
  merriamwebster,
  websterlearner,
  wikipedia,
  youdao,
  zdic,
  baidu: DefaultView,
  caiyun: DefaultView,
  google: DefaultView,
  mojidict: DefaultView,
  sogou: DefaultView,
  tencent: DefaultView,
  youdaotrans: DefaultView,
}

export default CompMap
