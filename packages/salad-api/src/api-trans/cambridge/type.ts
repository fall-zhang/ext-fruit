import type { DictSearchResult } from '@/core/api-server/api-common/search-type'

export type CambridgeResultItem = {
  id: string
  html: string
}

export type CambridgeResult = CambridgeResultItem[]

export type CambridgeSearchResult = DictSearchResult<CambridgeResult>
