import type { ApiInfo } from '../../types/api-info'

export default (): ApiInfo => ({
  enName: 'liangan',
  zhName: '两岸词典',
  from: ['zh-TW'],
  to: ['zh-TW'],
  type: 'self-trans',
  maxWord: 5,
  minWord: 1,
})
