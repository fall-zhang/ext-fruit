import type { ApiInfo } from '../../types/api-info'

export default (): ApiInfo => ({
  from: ['en', 'zh-CN', 'zh-TW'],
  to: ['en', 'zh-CN', 'zh-TW'],
  enName: 'Cambridge Dictionary',
  zhName: '剑桥词典',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,
})
