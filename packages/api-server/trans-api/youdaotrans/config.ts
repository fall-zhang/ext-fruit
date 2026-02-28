import type { Language } from '@P/open-trans/languages'
import type { SubUnion } from '@P/api-server/types/type-utils'
import { machineConfig } from '@P/api-server/gen-trans-conf'
import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'

export type YoudaotransLanguage = SubUnion<
  Language,
  'zh-CN' | 'en' | 'pt' | 'es' | 'ja' | 'ko' | 'fr' | 'ru'
>

export type YoudaotransConfig = DictItemBase & DictItemOption<YoudaotransLanguage>

export default (): YoudaotransConfig =>
  machineConfig<YoudaotransConfig>(
    ['zh-CN', 'en', 'pt', 'es', 'ja', 'ko', 'fr', 'ru'],
    {
      lang: '11011111',
    }
  )
