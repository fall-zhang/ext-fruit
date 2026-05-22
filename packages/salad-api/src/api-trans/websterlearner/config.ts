import type { ApiInfo } from '../../types/api-info'


export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Merriam-Webster\'s Dictionary',
  zhName: '韦氏学习词典',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})
export default getPreference
