// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import type { MachineDictItem } from '@P/saladict-core/src/components/MachineTrans/engine'
import { machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import type { Language } from '@P/open-trans/translator'
// import { SubUnion } from '@/typings/helpers'
import type { SubUnion } from '@P/saladict-core/src/types/helpers'
export type BaiduLanguage = SubUnion<
  Language,
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru' | 'nl'
>

export type BaiduConfig = MachineDictItem<BaiduLanguage>

export default (): BaiduConfig =>
  machineConfig<BaiduConfig>(
    ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
    {},
    {},
    {}
  )
