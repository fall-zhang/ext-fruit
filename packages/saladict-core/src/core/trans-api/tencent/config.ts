// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'\
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import { Language } from '@P/open-trans/translator'
// import { Subunion } from '@/typings/helpers'
import { Subunion } from '@P/saladict-core/src/types/helpers'

export type TencentLanguage = Subunion<
  Language,
  'zh-CN' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type TencentConfig = MachineDictItem<TencentLanguage>

export default (): TencentConfig =>
  machineConfig<TencentConfig>(
    ['zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
    {
      lang: '11011111'
    },
    {},
    {}
  )
