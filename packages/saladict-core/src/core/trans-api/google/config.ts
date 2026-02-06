// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import { Language } from '@P/open-trans/translator'
// import { SubUnion } from '@/typings/helpers'
import { SubUnion } from '@P/saladict-core/src/types/helpers'
export type GoogleLanguage = SubUnion<
  Language,
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru' | 'nl'
>

export type GoogleConfig = MachineDictItem<
  GoogleLanguage,
  {
    concurrent: boolean
  }
>

export default (): GoogleConfig =>
  machineConfig<GoogleConfig>(
    ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
    {},
    {
      concurrent: false
    },
    {}
  )
