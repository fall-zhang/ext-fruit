

import type { DictItemBase, DictItemOption } from '@/core/api-server/types/dict-base'
import type { ExtendSupportLang } from '@P/open-trans/languages/src/languages'
import type { ApiInfo } from '../../types/api-info'

export type CaiyunLanguage = ExtendSupportLang<'zh-CN' | 'en' | 'ja'>

export type CaiyunConfig = DictItemBase & DictItemOption<CaiyunLanguage>

export default (): ApiInfo => ({
  from: ['en', 'zh-CN', 'ja'],
  to: ['en', 'zh-CN', 'ja'],
  enName: 'LingoCloud',
  zhName: '彩云小译',
  type: 'paragraph-trans',
  maxWord: 99999999,
  minWord: 1,
})
