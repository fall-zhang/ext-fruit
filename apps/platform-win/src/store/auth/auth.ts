import { auth as baidu } from '@/core/trans-api/baidu/auth'
import { auth as caiyun } from '@/core/trans-api/caiyun/auth'
import { auth as sogou } from '@/core/trans-api/sogou/auth'
import { auth as tencent } from '@/core/trans-api/tencent/auth'
import { auth as youdaotrans } from '@/core/trans-api/youdaotrans/auth'
import { cloneDeep } from 'es-toolkit'
export const defaultDictAuths = {
  baidu,
  caiyun,
  sogou,
  tencent,
  youdaotrans,
}

export type DictAuths = typeof defaultDictAuths

export const getDefaultDictAuths = (): DictAuths => cloneDeep(defaultDictAuths)
