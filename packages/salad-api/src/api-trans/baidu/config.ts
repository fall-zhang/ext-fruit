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
  from: ['en'],
  to: ['en'],
  enName: 'American Heritage Dict',
  zhName: '美国传统词典',
  type: 'self-trans',
  maxWord: 5,
  minWord: 1,
  needAuth: true,
})
