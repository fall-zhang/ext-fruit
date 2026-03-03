import type { Language } from '@P/open-trans/translator'
// import { SubUnion } from '@/typings/helpers'
import { machineConfig } from '@P/api-server/gen-trans-conf'
import type { SubUnion } from '@P/api-server/types/type-utils'
import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'
export type SogouLanguage = SubUnion<
  Language,
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type SogouConfig = DictItemBase & DictItemOption<SogouLanguage>

export default (): SogouConfig =>
  machineConfig<SogouConfig>(
    ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
    {}
  )
