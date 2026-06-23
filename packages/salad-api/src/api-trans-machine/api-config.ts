
import baidu from './baidu/config'

import caiyun from './caiyun/config'

import google from './google/config'

import hjdict from './hjdict/config'

import sogou from './sogou/config'

import tencent from './tencent/config'

import youdaotrans from './youdaotrans/config'

export const allMachineDicts = {
  baidu: baidu(),

  caiyun: caiyun(),

  google: google(),

  hjdict: hjdict(),

  sogou: sogou(),

  tencent: tencent(),

  youdaotrans: youdaotrans(),
}

export type MachineDictConfig = typeof allMachineDicts

export type MachineDictID = keyof MachineDictConfig
