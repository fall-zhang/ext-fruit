
import type { ApiInfo } from '../../types/api-info'


export interface AuthBody {
  token: string
}

export const auth: AuthBody = {
  token: '',
}

export const url = 'https://fanyi.caiyunapp.com/#/api'

export default (): ApiInfo => ({
  from: ['en', 'zh-CN', 'ja'],
  to: ['en', 'zh-CN', 'ja'],
  enName: 'LingoCloud',
  zhName: '彩云小译',
  type: 'paragraph-trans',
  maxWord: 99999999,
  minWord: 1,
  needAuth: true,
})
