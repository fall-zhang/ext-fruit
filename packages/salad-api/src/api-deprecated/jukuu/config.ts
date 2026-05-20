import type { DictItemBase } from '@/core/api-server/types/dict-base'
import type { ApiInfo } from '../../types/api-info'
export type JukuuConfig = DictItemBase & {
  options: {
    lang: 'zheng' | 'engjp' | 'zhjp'
  },
  optionalVal: {
    lang: Array<'zheng' | 'engjp' | 'zhjp'>,
  },
}

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
