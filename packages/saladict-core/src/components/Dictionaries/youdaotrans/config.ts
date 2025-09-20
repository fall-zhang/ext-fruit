<<<<<<< HEAD:packages/trans-api/src/youdaotrans/config.ts
import { MachineDictItem, machineConfig } from '@P/saladict-core/src/components/MachineTrans/engine'
import { Language } from '@opentranslate/translator'
import { Subunion } from '@/typings/helpers'
=======
import {
  MachineDictItem,
  machineConfig
} from '@/components/MachineTrans/engine'
import { Language } from '@P/open-trans/translator'
import { Subunion } from '@/types/helpers'
>>>>>>> c908eaa999dbc831b8e70709cf53b61208abd9f2:packages/saladict-core/src/components/Dictionaries/youdaotrans/config.ts

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
