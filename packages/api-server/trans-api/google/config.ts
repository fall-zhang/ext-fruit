import type { Language } from '@P/open-trans/translator'
import type { SubUnion } from '../../types/type-utils'
import type { DictItemBase, DictItemOption } from '../../types/dict-base'
import { machineConfig } from '@P/api-server/gen-trans-conf'
export type GoogleLanguage = SubUnion<
  Language,
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru' | 'nl'
>

export type GoogleConfig = DictItemBase & DictItemOption<GoogleLanguage>

export default (): GoogleConfig => machineConfig<GoogleConfig>(
  ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
  {}
)
