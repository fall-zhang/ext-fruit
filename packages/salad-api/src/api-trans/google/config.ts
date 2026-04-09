import type { ApiInfo } from '../../types/api-info'

export default (): ApiInfo => ({
  from: ['en', 'zh-CN', 'zh-TW', 'ja', 'fr', 'de', 'es'],
  to: ['en', 'zh-CN', 'zh-TW', 'ja', 'fr', 'de', 'es'],
  enName: 'American Heritage Dict',
  zhName: '美国传统词典',
  type: 'self-trans',
  maxWord: 9999999,
  minWord: 1,
})
