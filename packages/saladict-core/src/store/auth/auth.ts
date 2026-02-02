import { auth as baidu } from 'open-trans/service-baidu/index'
import { auth as caiyun } from 'open-trans/src/caiyun/auth'
import { auth as sogou } from 'open-trans/src/sogou/auth'
import { auth as tencent } from 'open-trans/src/tencent/auth'
import { auth as youdaotrans } from 'open-trans/src/youdaotrans/auth'
import { cloneDeep } from 'es-toolkit'
export const defaultDictAuths = {
  baidu,
  caiyun,
  sogou,
  tencent,
  youdaotrans
}

export type DictAuths = typeof defaultDictAuths

export const getDefaultDictAuths = (): DictAuths => cloneDeep(defaultDictAuths)
