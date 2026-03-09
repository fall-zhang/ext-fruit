
import { fetchDirtyDOM } from '@P/api-server/utils/fetch-dom'

import type { EudicResult, EudicResultItem } from './type'
import type { GetSrcPageFunction } from '@P/api-server/api-common/atom-type'
import type { DictSearchResult, SearchFunction } from '@P/api-server/api-common/search-type'
import { handleNetWorkError, getText, handleNoResult } from '@P/api-server/utils'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://dict.eudic.net/dicts/en/${text}`
}

type EudicSearchResult = DictSearchResult<EudicResult>


export const search: SearchFunction<EudicResult> = (
  text,
  opt
) => {
  const newText = encodeURIComponent(
    text
      .split(/\s+/)
      .slice(0, 2)
      .join(' ')
  )
  const options = opt.profile.eudic.options

  return fetchDirtyDOM('https://dict.eudic.net/dicts/en/' + newText, {
    withCredentials: false,
  })
    .catch(handleNetWorkError)
    .then(validator)
    .then(doc => handleDOM(doc, options))
}

function handleDOM (
  doc: Document,
  { resultCount }: { resultCount: number }
): EudicSearchResult | Promise<EudicSearchResult> {
  const result: EudicResult = []
  const audio: { uk?: string; us?: string } = {}

  const $items = Array.from(doc.querySelectorAll('#lj_ting .lj_item'))
  for (let i = 0; i < $items.length && result.length < resultCount; i++) {
    const $item = $items[i]
    const item: EudicResultItem = { chs: '', eng: '' }

    item.chs = getText($item, '.exp')
    if (!item.chs) {
      continue
    }

    item.eng = getText($item, '.line')
    if (!item.eng) {
      continue
    }

    item.channel = getText($item, '.channel_title')

    const audioID = $item.getAttribute('source')
    if (audioID) {
      const mp3 =
        'https://fs-gateway.eudic.net/store_main/sentencemp3/' +
        audioID +
        '.mp3'
      item.mp3 = mp3
      if (!audio.us) {
        audio.us = mp3
        audio.uk = mp3
      }
    }

    result.push(item)
  }

  if (result.length > 0) {
    return { result, audio }
  }

  return handleNoResult()
}

function validator (doc: Document): Document | Promise<Document> {
  if (doc.querySelector('#TingLiju')) {
    return doc
  }

  const status = doc.querySelector('#page-status') as HTMLInputElement
  if (!status || !status.value) {
    return handleNoResult()
  }

  const formData = new FormData()
  formData.append('status', status.value)

  return fetchDirtyDOM('https://dict.eudic.net/Dicts/en/tab-detail/-12', {
    method: 'POST',
    data: formData,
    withCredentials: false,
  })
}
