import {
  MachineDictItem,
  machineConfig
} from '@/components/MachineTrans/engine'
import { Language } from '@P/open-trans/translator'
import { Subunion } from '@/types/helpers'

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
