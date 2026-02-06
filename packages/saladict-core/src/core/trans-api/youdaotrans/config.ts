// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'
// import { Language } from '@opentranslate/translator'
import { Language } from '@P/open-trans/languages'
// import { SubUnion } from '@/typings/helpers'
import { SubUnion } from '@P/saladict-core/src/types/helpers'

export type YoudaotransLanguage = SubUnion<
  Language,
  'zh-CN' | 'en' | 'pt' | 'es' | 'ja' | 'ko' | 'fr' | 'ru'
>

export type YoudaotransConfig = MachineDictItem<YoudaotransLanguage>

export default (): YoudaotransConfig =>
  machineConfig<YoudaotransConfig>(
    ['zh-CN', 'en', 'pt', 'es', 'ja', 'ko', 'fr', 'ru'],
    {
      lang: '11011111'
    },
    {},
    {}
  )
