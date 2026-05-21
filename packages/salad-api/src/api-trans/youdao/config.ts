import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN'],
  to: ['en', 'zh-CN'],
  enName: 'Youdao Dictionary',
  zhName: '有道词典',
  type: 'paragraph-trans',
  maxWord: 5,
  minWord: 1,
})

export default getPreference
