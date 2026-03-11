import type { Language } from '@P/open-trans/languages'
import type { AllDictsConf } from '@/core/api-server/types/all-dict-conf'
import { search } from '@/core/api-server/trans-api/baidu/engine'
import type { AppConfigMutable } from '@/config/app-config'
import type { DictSearchResult } from './api-common/search-type'
import type { DictID } from './types'

// function getDictEngine (dictID:DictID) {
//   return import(`./trans-api/${dictID}/engine.ts`)
// }

type FetchParam = {
  id: DictID
  text: string
  /** engine search function payload */
  from?: Language
  to?: Language
  config: AppConfigMutable
  profile: AllDictsConf
}

export async function fetchDictResult (data: FetchParam): Promise<{
  id: DictID
  result: any
  catalog?: DictSearchResult<DictID>['catalog']
  audio?: DictSearchResult<DictID>['audio']
}> {
  let response: DictSearchResult<any> | undefined

  try {
    // const { search } = await getDictEngine(data.id)

    try {
      response = await search(data.text, {
        profile: data.profile,
      })
    } catch (e: any) {
      if (e.message === 'NETWORK_ERROR') {
        // retry once
        response = await search(data.text, {
          profile: data.profile,
        })
      } else {
        throw e
      }
    }
  } catch (e) {
    console.warn(data.id, e)
  }

  const result = response
    ? { ...response, id: data.id }
    : { result: null, id: data.id }

  console.log(`Search Engine ${data.id}`, data.text, result)

  return result
}
