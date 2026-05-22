import type { ApiInfo } from '../../types/api-info'

const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN', 'ja'],
  to: ['en', 'zh-CN', 'ja'],
  enName: 'Jukuu',
  zhName: '句酷',
  type: 'paragraph-trans',
  maxWord: 99999,
  minWord: 1,
})

export default getPreference
