import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['zh-CN'],
  to: ['zh-CN'],
  enName: 'Jikipedia',
  zhName: '小鸡词典',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})

export default getPreference
