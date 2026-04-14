
import type { EudicResult, EudicResultItem } from './type'
import { getText } from '../../utils/dom-utils'
import type { AtomSearchResult } from '../../types/res-type'

type EudicSearchResult = AtomSearchResult<EudicResult>

export function handleDOM (
  doc: Document,
  options: { resultCount: number }
): EudicSearchResult | Promise<EudicSearchResult> {
  const result: EudicResult = []
  const audio: { uk?: string; us?: string } = {}

  const $items = Array.from(doc.querySelectorAll('#lj_ting .lj_item'))
  for (let i = 0; i < $items.length && result.length < options.resultCount; i++) {
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

  return { result: [] }
}
