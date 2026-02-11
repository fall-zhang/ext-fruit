import type { MachineDictItem } from '@P/saladict-core/src/components/MachineTrans/engine'
import { machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import type { Language } from '@P/open-trans/translator'
// import { SubUnion } from '@/typings/helpers'
import type { SubUnion } from '@P/saladict-core/src/types/helpers'

export type TencentLanguage = SubUnion<
  Language,
  'zh-CN' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type TencentConfig = MachineDictItem<TencentLanguage>

export default (): TencentConfig =>
  machineConfig<TencentConfig>(
    ['zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
    {
      lang: '11011111',
    }
  )
