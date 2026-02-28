import { machineConfig, type DictItemBase } from '@P/api-server/gen-trans-conf'

import type { Language } from '@P/open-trans/translator'
import type { SubUnion } from '@P/saladict-core/src/types/utils'
// import { SubUnion } from '@/typings/helpers'
export type BaiduLanguage = SubUnion<
  Language,
  'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru' | 'nl'
>

export type BaiduConfig = DictItemBase<BaiduLanguage>

export default (): BaiduConfig =>
  machineConfig<BaiduConfig>(
    ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
    {}
  )
