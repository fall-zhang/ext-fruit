import type { ApiInfo } from '../../types/api-info'

export type AuthBody = {
  secretId: string
  secretKey: string
}

export const auth: AuthBody = {
  secretId: '',
  secretKey: '',
}

export const url = 'https://curl.qcloud.com/imsowZzT'

export const getPreference = (): ApiInfo => ({
  from: ['zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  to: ['zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  enName: 'Tencent Translate',
  zhName: '腾讯翻译君',
  type: 'paragraph-trans',
  maxWord: 9999999,
  minWord: 1,
  needAuth: true,
})

export default getPreference

