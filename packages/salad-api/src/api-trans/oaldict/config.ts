import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Oxford Learner\'s Dict',
  zhName: '牛津高阶词典',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})
export default getPreference
