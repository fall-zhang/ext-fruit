

import type { Language } from '@P/open-trans/translator'
import { machineConfig } from '@P/api-server/gen-trans-conf'
import type { SubUnion } from '@P/saladict-core/src/types/utils'
import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'

// import { SubUnion } from '@/typings/helpers'

export type CaiyunLanguage = SubUnion<Language, 'zh-CN' | 'en' | 'ja'>

export type CaiyunConfig = DictItemBase & DictItemOption<CaiyunLanguage>

export default (): CaiyunConfig =>
  machineConfig<CaiyunConfig>(
    ['zh-CN', 'en', 'ja'],
    {
      lang: '11010000',
    }
  )
