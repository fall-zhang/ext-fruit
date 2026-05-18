import type { AuthApiInfo } from '../../types/api-info'

export const url = 'https://translate.google.com'
export const auth: AuthBody = {
  token: '',
}

export type AuthBody = {
  token: string
}

export const getPreference = (): AuthApiInfo<AuthBody> => ({
  from: ['en', 'zh-CN', 'zh-TW', 'ja', 'fr', 'de', 'es'],
  to: ['en', 'zh-CN', 'zh-TW', 'ja', 'fr', 'de', 'es'],
  enName: 'Google Translate',
  zhName: '谷歌翻译',
  type: 'paragraph-trans',
  maxWord: 9999999,
  minWord: 1,
  needAuth: true,
  auth: {
    token: '',
  },
})


export default getPreference
