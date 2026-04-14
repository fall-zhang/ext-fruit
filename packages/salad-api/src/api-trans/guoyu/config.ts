import type { ApiInfo } from '../../types/api-info'

export default (): ApiInfo => ({
  from: ['zh-CN', 'zh-TW'],
  to: ['zh-CN', 'zh-TW'],
  enName: 'GuoYu Dictionary',
  zhName: '国语词典',
  type: 'self-trans',
  maxWord: 5,
  minWord: 1,
})
