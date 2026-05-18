import type { ApiInfo } from '../../types/api-info'

const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN', 'zh-TW', 'ja'],
  to: ['en', 'zh-CN', 'zh-TW', 'ja'],
  enName: 'Google Dictionary',
  zhName: '谷歌词典',
  type: 'word-trans',
  maxWord: 5,
  minWord: 1,

})
export default getPreference
