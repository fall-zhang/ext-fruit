import { auth as baidu } from '@P/saladict-core/src/core/trans-api/baidu/auth'
import { auth as caiyun } from '@P/saladict-core/src/core/trans-api/caiyun/auth'
import { auth as sogou } from '@P/saladict-core/src/core/trans-api/sogou/auth'
import { auth as tencent } from '@P/saladict-core/src/core/trans-api/tencent/auth'
import { auth as youdaotrans } from '@P/saladict-core/src/core/trans-api/youdaotrans/auth'
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
