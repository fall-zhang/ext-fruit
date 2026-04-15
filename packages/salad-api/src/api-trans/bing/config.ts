import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN'],
  to: ['en', 'zh-CN'],
  enName: 'Bing Dict',
  zhName: '必应词典',
  type: 'self-trans',
  maxWord: 5,
  minWord: 1,
})
