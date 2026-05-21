import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN'],
  to: ['en', 'zh-CN'],
  enName: 'Eudic',
  zhName: '双语例句',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
  needAuth: false,
})

export default getPreference
