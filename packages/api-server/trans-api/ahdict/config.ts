import { machineConfig } from '@P/api-server/gen-trans-conf'
import type { BaiduConfig } from '../baidu/config'
import type { DictItemBase } from '@P/api-server/types/dict-base'

export type AhdictConfig = DictItemBase & {
  resultCount: number
}


export default (): BaiduConfig =>
  machineConfig<BaiduConfig>(
    ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
    {}
  )
