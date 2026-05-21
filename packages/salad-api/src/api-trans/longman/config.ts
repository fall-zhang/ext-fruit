import type { ApiInfo } from '../../types/api-info'

export default (): ApiInfo => ({
  enName: 'Longman Dictionary',
  zhName: '朗文词典',
  from: ['en'],
  to: ['en'],
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})
