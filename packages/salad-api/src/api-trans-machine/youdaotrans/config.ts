import type { ExtendSupportLang } from '../../types'
import type { AuthApiInfo } from '../../types/api-info'

export type YoudaotransLanguage = ExtendSupportLang<
  'zh-CN' | 'en' | 'pt' | 'es' | 'ja' | 'ko' | 'fr' | 'ru'
>

export interface AuthBody {
  appKey: string
  key: string
}

export const auth: AuthBody = {
  appKey: '',
  key: '',
}

export const url = 'http://ai.youdao.com/gw.s'

export const getPreference = (): AuthApiInfo<AuthBody> => ({
  from: ['en', 'zh-CN', 'ja', 'ko', 'fr', 'es', 'ru'] satisfies YoudaotransLanguage[],
  to: ['en', 'zh-CN', 'ja', 'ko', 'fr', 'es', 'ru'] satisfies YoudaotransLanguage[],
  enName: 'Youdao Translate',
  zhName: '有道翻译',
  type: 'paragraph-trans',
  maxWord: 99999999,
  minWord: 1,
  needAuth: true,
  auth,
})
export default getPreference
