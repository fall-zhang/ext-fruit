import type { DictItemBase, DictItemOption } from '@/core/api-server/types/dict-base'
import type { ExtendSupportLang } from '@P/open-trans/languages/src/languages'
import type { ApiInfo } from '../../types/api-info'

export type SogouLanguage = ExtendSupportLang<
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type SogouConfig = DictItemBase & DictItemOption<SogouLanguage>

export interface AuthBody {
  pid: string
  key: string
}

export const auth: AuthBody = {
  pid: '',
  key: '',
}

export const url = 'https://deepi.sogou.com/?from=translatepc'

export default (): ApiInfo => ({
  from: ['auto', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  to: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  enName: 'Sogou Translation',
  zhName: '搜狗翻译',
  type: 'paragraph-trans',
  maxWord: 9999999,
  minWord: 1,
  needAuth: true,
})
