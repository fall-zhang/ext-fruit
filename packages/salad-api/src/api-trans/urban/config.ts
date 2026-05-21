import type { ApiInfo } from '../../types/api-info'


export const getPreference = (): ApiInfo => ({
  from: ['zh-CN', 'en'],
  to: ['zh-CN', 'en'],
  enName: 'Urban',
  zhName: 'Urban',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
  needAuth: true,
})
export default getPreference

