import { auth as baidu } from '@/core/api-server/trans-api/baidu/auth'
import { auth as caiyun } from '@/core/api-server/trans-api/caiyun/auth'
import { auth as sogou } from '@/core/api-server/trans-api/sogou/auth'
import { auth as tencent } from '@/core/api-server/trans-api/tencent/auth'
import { auth as youdaotrans } from '@/core/api-server/trans-api/youdaotrans/auth'
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
