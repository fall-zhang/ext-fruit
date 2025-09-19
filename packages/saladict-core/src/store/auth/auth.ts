import { auth as baidu } from '@P/trans-api/src/baidu/auth'
import { auth as caiyun } from '@P/trans-api/src/caiyun/auth'
import { auth as sogou } from '@P/trans-api/src/sogou/auth'
import { auth as tencent } from '@P/trans-api/src/tencent/auth'
import { auth as youdaotrans } from '@P/trans-api/src/youdaotrans/auth'
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
