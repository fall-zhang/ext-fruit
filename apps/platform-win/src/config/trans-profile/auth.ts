import { auth as baidu } from '@P/salad-api/src/api-trans-machine/baidu/config'
import { auth as caiyun } from '@P/salad-api/src/api-trans-machine/caiyun/config'
import { auth as sogou } from '@P/salad-api/src/api-trans-machine/sogou/config'
import { auth as youdaotrans } from '@P/salad-api/src/api-trans-machine/youdaotrans/config'
import { auth as google } from '@P/salad-api/src/api-trans-machine/google/config'
import { cloneDeep } from 'es-toolkit'
export const defaultDictAuths = {
  baidu,
  caiyun,
  // sogou,
  google,
  youdaotrans,
}

export type DictAuths = typeof defaultDictAuths
// export type DictAuths = Record<string, unknown>
// export const getDefaultDictAuths = () => ({})
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
      // sogou: {
      //   pid: import.meta.env.VITE_SOGOU_PID,
      //   key: import.meta.env.VITE_SOGOU_KEY,
      // },
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
