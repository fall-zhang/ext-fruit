// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import { Language } from '@P/open-trans/translator'
// import { Subunion } from '@/typings/helpers'
import { Subunion } from '@P/saladict-core/src/types/helpers'
export type BaiduLanguage = Subunion<
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
