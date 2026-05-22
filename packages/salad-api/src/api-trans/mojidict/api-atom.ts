import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { handleNoResult, handleNetWorkError } from '../../utils/error-response'
import type { MojidictResult, SuggestsResult, FetchWordResult, FetchTtsResult } from './type'
import type { AtomSearchResult } from '../../types/res-type'
import { getSuggests, getTTS, requestPayload } from './engine'

export const getSrcPage: AtomGetSrcFunction = async (text) => {
  const suggests = await getSuggests(text).catch(() => null)
  if (suggests) {
    const tarId =
      suggests.searchResults &&
      suggests.searchResults[0] &&
      suggests.searchResults[0].tarId
    if (tarId) {
      return `https://www.mojidict.com/details/${tarId}`
    }
  }
  return 'https://www.mojidict.com'
}

export const getFetchRequest: AtomFetchRequest = (text, _opt) => {
  // Mojidict requires POST requests with special payload, so we return a dummy request
  // The actual API calls are handled in handleResponse
  return new Request('https://api.mojidict.com/parse/functions/search_v3', {
    method: 'POST',
    headers: {
      'content-type': 'text/plain',
    },
    body: requestPayload({
      langEnv: 'zh-CN_ja',
      needWords: true,
      searchText: text,
    }),
  })
}

export const handleResponse: AtomResponseHandle = async (res) => {
  // Parse the suggests response
  let suggests: SuggestsResult | null = null
  try {
    const data = await res.json()
    suggests = data.result || null
  } catch {
    return handleNoResult()
  }

  if (!suggests) {
    return handleNoResult()
  }

  const tarId = suggests.searchResults?.[0]?.tarId
  if (!tarId) {
    return handleNoResult()
  }

  // Fetch word details
  let wordResult: FetchWordResult | null = null
  try {
    const detailResponse: AxiosResponse<{ result: FetchWordResult }> = await axios({
      method: 'post',
      url: 'https://api.mojidict.com/parse/functions/fetchWord_v2',
      headers: {
        'content-type': 'text/plain',
      },
      data: requestPayload({ wordId: tarId }),
    })
    wordResult = detailResponse.data.result
  } catch {
    return handleNoResult()
  }

  const result: MojidictResult = {}

  if (wordResult && (wordResult.details || wordResult.word)) {
    if (wordResult.word) {
      result.word = {
        tarId,
        spell: wordResult.word.spell,
        pron: `${wordResult.word.pron || ''} ${wordResult.word.accent || ''}`,
      }
    }

    if (wordResult.details) {
      result.details = wordResult.details.map(detail => ({
        objectId: detail.objectId,
        title: detail.title,
        subdetails: wordResult?.subdetails
          ?.filter(subdetail => subdetail.detailsId === detail.objectId)
          .map(subdetail => ({
            objectId: subdetail.objectId,
            title: subdetail.title,
            examples: wordResult?.examples?.filter(
              example => example.subdetailsId === subdetail.objectId
            ),
          })),
      }))
    }

    if (suggests.words && suggests?.words.length > 1) {
      result.releated = suggests.words
        .map(word => ({
          title: `${word.spell} | ${word.pron || ''} ${word.accent || ''}`,
          excerpt: word.excerpt,
        }))
        .slice(1)
    }

    if (result.word) {
      result.word.tts = await getTTS(tarId, 102)
      const searchResult: AtomSearchResult<MojidictResult> = { result }
      searchResult.audio = { py: result.word.tts }
      return searchResult
    }

    return { result }
  }

  return handleNoResult()
}
