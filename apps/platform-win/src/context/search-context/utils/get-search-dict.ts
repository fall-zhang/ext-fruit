import type { DictID } from '@P/salad-api/src/api-trans'
import type { SupportLanguage } from '@P/salad-api/src/main'
import type { UnitSearchResult } from '@P/salad-api/src/types/res-type'
export type RenderDictItem = {
  dictID: DictID
  // idle 闲置
  searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  from: SupportLanguage
  to: SupportLanguage
  searchResult?: UnitSearchResult
}

export const getSearchDict = ({
  enableDicts,
  dictId,
}: {
  dictId?: DictID
  enableDicts: DictID[]
  fromLang: SupportLanguage
}): RenderDictItem[] => {
  // dicts that should be rendered
  return []
}
