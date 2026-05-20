import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Lexico',
  zhName: 'Lexico',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})
