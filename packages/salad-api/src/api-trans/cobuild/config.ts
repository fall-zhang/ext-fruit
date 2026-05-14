import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'COBUILD',
  zhName: '柯林斯高阶',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
  needAuth: true,
})

export default getPreference
