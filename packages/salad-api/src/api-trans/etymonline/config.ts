import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Etymonline',
  zhName: 'Etymonline',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
  needAuth: false,
})

export default getPreference
