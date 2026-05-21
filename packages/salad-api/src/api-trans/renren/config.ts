import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['zh-CN', 'en'],
  to: ['zh-CN', 'en'],
  enName: '91dict',
  zhName: '人人词典',
  type: 'paragraph-trans',
  maxWord: 999,
  minWord: 1,
  needAuth: true,
})

export default getPreference

