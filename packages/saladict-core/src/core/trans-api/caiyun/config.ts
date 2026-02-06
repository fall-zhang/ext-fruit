// import {
//   MachineDictItem,
//   machineConfig
// } from '@/components/MachineTrans/engine'
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'

import { Language } from '@P/open-trans/translator'

// import { SubUnion } from '@/typings/helpers'
import { SubUnion } from '@P/saladict-core/src/types/helpers'

export type CaiyunLanguage = SubUnion<Language, 'zh-CN' | 'en' | 'ja'>

export type CaiyunConfig = MachineDictItem<CaiyunLanguage>

export default (): CaiyunConfig =>
  machineConfig<CaiyunConfig>(
    ['zh-CN', 'en', 'ja'],
    {
      lang: '11010000'
    },
    {},
    {}
  )
