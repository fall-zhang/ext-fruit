
import type { MachineDictItem } from '@P/saladict-core/src/components/MachineTrans/engine'

import type { Language } from '@P/open-trans/translator'
import { machineConfig } from '@P/api-server/gen-trans-conf'
import type { SubUnion } from '@P/saladict-core/src/types/utils'

// import { SubUnion } from '@/typings/helpers'

export type CaiyunLanguage = SubUnion<Language, 'zh-CN' | 'en' | 'ja'>

export type CaiyunConfig = MachineDictItem<CaiyunLanguage>

export default (): CaiyunConfig =>
  machineConfig<CaiyunConfig>(
    ['zh-CN', 'en', 'ja'],
    {
      lang: '11010000',
    }
  )
