import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['ja'],
  to: ['ja'],
  enName: 'Weblio',
  zhName: 'Weblio 辞書',
  type: 'word-trans',
  maxWord: 20,
  minWord: 1,
})
export default getPreference
