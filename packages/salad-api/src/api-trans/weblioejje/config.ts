import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en', 'ja'],
  to: ['en', 'ja'],
  enName: 'Weblio ejje',
  zhName: 'Weblio 英和和英',
  type: 'paragraph-trans',
  maxWord: 999,
  minWord: 1,
})
export default getPreference
