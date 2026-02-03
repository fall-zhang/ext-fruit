import { DictID } from '../app-config'
import { DictSearchResult } from '@P/saladict-core/src/core/trans-api/helpers'

export async function fetchDictResult (
  data: {
    id: DictID
    text: string
    /** engine search function payload */
    payload: {
      [index: string]: any
    }
  }
): Promise<{
  id: DictID
  result: any
  catalog?: DictSearchResult<DictID>['catalog']
  audio?: DictSearchResult<DictID>['audio']
}> {
  const payload = data.payload || {}

  let response: DictSearchResult<any> | undefined

  try {
    const { search } = await BackgroundServer.getDictEngine<
      NonNullable<typeof data['payload']>
    >(data.id)

    try {
      response = await timeout(
        search(data.text, window.appConfig, window.activeProfile, payload),
        25000
      )
    } catch (e) {
      if (e.message === 'NETWORK_ERROR') {
        // retry once
        await timer(500)
        response = await timeout(
          search(data.text, window.appConfig, window.activeProfile, payload),
          25000
        )
      } else {
        throw e
      }
    }
  } catch (e) {
    if (process.env.DEBUG) {
      console.warn(data.id, e)
    }
  }

  const result = response
    ? { ...response, id: data.id }
    : { result: null, id: data.id }

  if (process.env.DEBUG) {
    console.log(`Search Engine ${data.id}`, data.text, result)
  }

  return result
}
