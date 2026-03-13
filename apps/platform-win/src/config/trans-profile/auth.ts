import { auth as baidu } from '@/core/api-server/trans-api/baidu/auth'
import { auth as caiyun } from '@/core/api-server/trans-api/caiyun/auth'
import { auth as sogou } from '@/core/api-server/trans-api/sogou/auth'
import { auth as tencent } from '@/core/api-server/trans-api/tencent/auth'
import { auth as youdaotrans } from '@/core/api-server/trans-api/youdaotrans/auth'
import { auth as google } from '@/core/api-server/trans-api/google/auth'
import { cloneDeep } from 'es-toolkit'
export const defaultDictAuths = {
  baidu,
  caiyun,
  sogou,
  tencent,
  google,
  youdaotrans,
}

export type DictAuths = typeof defaultDictAuths

export const getDefaultDictAuths = (): DictAuths => {
  if (import.meta.env.DEV === true) {
    return {
      baidu: {
        appid: import.meta.env.VITE_BAIDU_APP_ID,
        key: import.meta.env.VITE_BAIDU_APP_KEY,
      },
      caiyun: {
        token: import.meta.env.VITE_CAIYUN_TOKEN,
      },
      sogou: {
        pid: import.meta.env.VITE_SOGOU_PID,
        key: import.meta.env.VITE_SOGOU_KEY,
      },
      tencent: {
        secretId: import.meta.env.VITE_TENCENT_SECRET_ID,
        secretKey: import.meta.env.VITE_TENCENT_SECRET_KEY,
      },
      google: {
        token: import.meta.env.VITE_GOOGLE_TOKEN,
      },
      youdaotrans: {
        appKey: import.meta.env.VITE_YOUDAO_APPKEY,
        key: import.meta.env.VITE_YOUDAO_KEY,
      },
    }
  }

  return cloneDeep(defaultDictAuths)
}
