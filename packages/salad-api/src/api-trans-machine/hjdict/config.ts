import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en', 'ja', 'fr', 'de', 'es'],
  to: ['en', 'ja', 'fr', 'de', 'es'],
  enName: 'Hu Jiang',
  zhName: '沪江小D',
  type: 'word-trans',
  maxWord: 10,
  minWord: 1,
})
export default getPreference
