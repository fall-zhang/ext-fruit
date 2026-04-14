import type { ApiInfo } from '../../types/api-info'

export const url = 'http://api.fanyi.baidu.com/api/trans/product/prodinfo'

export type AuthBody = {
  appid: string
  key: string
}

export const auth: AuthBody = {
  appid: '',
  key: '',
}

export const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN', 'zh-TW'],
  to: ['en', 'zh-CN', 'zh-TW'],
  enName: 'Baidu Translate',
  zhName: '百度翻译',
  type: 'paragraph-trans',
  maxWord: 99999999,
  minWord: 1,
  needAuth: true,
})
