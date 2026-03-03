import type { Language } from '@P/open-trans/translator'
import type { SubUnion } from '../../types/type-utils'
import { machineConfig } from '@P/api-server/gen-trans-conf'
import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'
// import { SubUnion } from '@/typings/helpers'

export type TencentLanguage = SubUnion<
  Language,
  'zh-CN' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type TencentConfig = DictItemBase & DictItemOption<TencentLanguage>

export default (): TencentConfig =>
  machineConfig<TencentConfig>(
    ['zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
    {
      lang: '11011111',
    }
  )
