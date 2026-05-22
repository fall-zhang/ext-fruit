import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Vocabulary',
  zhName: 'Vocabulary.com',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})
export default getPreference
