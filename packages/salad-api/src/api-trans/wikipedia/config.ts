import type { ApiInfo } from '../../types/api-info'
export const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN', 'ja', 'fr', 'de'],
  to: ['en', 'zh-CN', 'ja', 'fr', 'de'],
  enName: 'Wikipedia',
  zhName: '维基百科',
  type: 'word-trans',
  maxWord: 999999999999999,
  minWord: 1,
})
export default getPreference
