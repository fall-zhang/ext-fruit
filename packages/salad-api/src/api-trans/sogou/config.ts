import type { ApiInfo, AuthApiInfo } from '../../types/api-info'

export interface AuthBody {
  pid: string
  key: string
}

export const auth: AuthBody = {
  pid: '',
  key: '',
}

export const url = 'https://deepi.sogou.com/?from=translatepc'

export default (): AuthApiInfo => ({
  from: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  to: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  enName: 'Sogou Translation',
  zhName: '搜狗翻译',
  type: 'paragraph-trans',
  maxWord: 9999999,
  minWord: 1,
  needAuth: true,
  auth,
})
