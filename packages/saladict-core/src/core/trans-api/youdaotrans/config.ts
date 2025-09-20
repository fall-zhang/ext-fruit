// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'
// import { Language } from '@opentranslate/translator'
import { Language } from '@P/open-trans/languages'
// import { Subunion } from '@/typings/helpers'
import { Subunion } from '@P/saladict-core/src/types/helpers'

export type YoudaotransLanguage = Subunion<
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
