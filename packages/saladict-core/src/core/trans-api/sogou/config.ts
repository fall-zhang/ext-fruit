// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import { Language } from '@P/open-trans/translator'
// import { SubUnion } from '@/typings/helpers'
import { SubUnion } from '@P/saladict-core/src/types/helpers'
export type SogouLanguage = SubUnion<
  Language,
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type SogouConfig = MachineDictItem<SogouLanguage>

export default (): SogouConfig =>
  machineConfig<SogouConfig>(
    ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
    {},
    {},
    {}
  )
