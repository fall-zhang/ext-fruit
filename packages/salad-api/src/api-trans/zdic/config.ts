import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['zh-CN', 'zh-TW'],
  to: ['zh-CN', 'zh-TW'],
  enName: '汉典',
  zhName: '汉典',
  type: 'word-trans',
  maxWord: 10,
  minWord: 1,
  needAuth: true,
})

export default getPreference
