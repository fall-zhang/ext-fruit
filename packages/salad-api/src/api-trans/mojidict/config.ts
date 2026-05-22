import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en', 'ja', 'zh-CN'],
  to: ['en', 'ja', 'zh-CN'],
  enName: 'MOJi辞書',
  zhName: 'MOJi辞書',
  type: 'paragraph-trans',
  maxWord: 5,
  minWord: 1,
})
export default getPreference
