import type { ApiInfo } from '../../types/api-info'

export const url = 'https://translate.google.com'

export default (): ApiInfo => ({
  from: ['en', 'zh-CN', 'zh-TW', 'ja', 'fr', 'de', 'es'],
  to: ['en', 'zh-CN', 'zh-TW', 'ja', 'fr', 'de', 'es'],
  enName: 'Google Translate',
  zhName: '谷歌翻译',
  type: 'paragraph-trans',
  maxWord: 9999999,
  minWord: 1,
})

export const auth: AuthBody = {
  token: '',
}

export type AuthBody = {
  token: string
}

export type GoogleConfig = {
  token: string
  options: {
    concurrent: number
    tl: string
    slInitial: string
  }
}
