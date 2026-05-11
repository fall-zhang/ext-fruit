import type { ApiInfo } from '../../types/api-info'


export const getPreference = (): ApiInfo => ({
  from: ['en', 'zh-CN'],
  to: ['en', 'zh-CN'],
  enName: 'CNKI Dict',
  zhName: 'CNKI翻译助手',
  type: 'paragraph-trans',
  maxWord: 100,
  minWord: 1,
  needAuth: false,
})

export default getPreference
