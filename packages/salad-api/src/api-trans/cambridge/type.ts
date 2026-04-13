import type { DictSearchResult } from '@/core/api-server/api-common/search-type'

type CambridgeResultItem = {
  id: string
  html: string
}

export type CambridgeResult = CambridgeResultItem[]

type CambridgeSearchResult = DictSearchResult<CambridgeResult>
