import type { ApiInfo } from '../../types/api-info'

export default (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'American Heritage Dict',
  zhName: '美国传统词典',
  type: 'self-trans',
  maxWord: 5,
  minWord: 1,
})
