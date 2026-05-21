import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['zh-CN', 'ja', 'ko'],
  to: ['zh-CN', 'ja', 'ko'],
  enName: 'Naver韩国语词典',
  zhName: 'Naver韩国语词典',
  type: 'word-trans',
  maxWord: 10,
  minWord: 1,
  needAuth: true,
})
export default getPreference

