import type { ApiInfo } from '../../types/api-info'

const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Macmillan',
  zhName: '麦克米伦',
  type: 'paragraph-trans',
  maxWord: 5,
  minWord: 1,
})

export default getPreference
