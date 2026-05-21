
import {
  getText,
  getInnerHTML
} from '../../utils/dom-utils'

import axios from 'axios'
import type { UrbanResult, UrbanResultItem, ThumbMap, thumbRes } from './type'
import { handleNoResult, handleNetWorkError } from '../../utils/error-response'
import type { AtomSearchResult } from '../../types/res-type'

export type { UrbanResult, UrbanResultItem } from './type'
const RESULT_COUNT = 5
// 需要代理 proxy
export const getSrcPage = (text: string): string => {
  return `http://www.urbandictionary.com/define.php?term=${text}`
}
const HOST = 'https://www.urbandictionary.com'

/** get thumbs-up and thumbs-down nums  */
async function getThumbsNums (ids: string): Promise<ThumbMap | null> {
  const thumbsMap: Record<number, {
    up: string,
    down: string,
  }> = {}

  const result = await axios
    .get<thumbRes>('https://api.urbandictionary.com/v0/uncacheable', {
      params: {
        ids,
      },
    })
    .catch(handleNetWorkError)

  if (!result?.data) {
    return null
  }

  result?.data?.thumbs?.forEach(t => {
    thumbsMap[t.defid] = {
      up: t.up + '',
      down: t.down + '',
    }
  })
  return thumbsMap
}

export async function handleDOM (
  doc: Document
): Promise<AtomSearchResult<UrbanResult>> {
  const result: UrbanResult = []
  const audio: { us?: string } = {}

  const defPanels = Array.from(doc.querySelectorAll('.def-panel'))

  if (defPanels.length <= 0) {
    return handleNoResult()
  }

  const defIds: string[] = []

  for (let i = 0; i < defPanels.length && result.length < RESULT_COUNT; i++) {
    const defId = defPanels[i]?.getAttribute('data-defid')

    defId && defIds.push(defId)
  }
  const thumbsMap = await getThumbsNums(defIds.join(','))

  for (let i = 0; i < defPanels.length && result.length < RESULT_COUNT; i++) {
    const $panel = defPanels[i]
    const defId = defPanels[i]?.getAttribute('data-defid') || ''

    const resultItem: UrbanResultItem = { title: '' }

    resultItem.title = getText($panel, '.word')
    if (!resultItem.title) {
      continue
    }

    const $pron = $panel.querySelector('.play-sound') as HTMLElement
    if ($pron && $pron.dataset.urls) {
      try {
        const pron = JSON.parse($pron.dataset.urls)[0]
        if (pron) {
          resultItem.pron = pron
          audio.us = pron
        }
      } catch (error) {
        /* ignore */
      }
    }

    resultItem.meaning = getInnerHTML(HOST, $panel, '.meaning')
    if (/There aren't any definitions for/i.test(resultItem.meaning || '')) {
      continue
    }

    resultItem.example = getInnerHTML(HOST, $panel, '.example')

    const $gif = $panel.querySelector('.gif > img') as HTMLImageElement
    if ($gif) {
      const $attr = $gif.nextElementSibling
      resultItem.gif = {
        src: $gif.src,
        attr: getText($attr),
      }
    }

    const $tags = Array.from($panel.querySelectorAll('.tags a'))
    if ($tags && $tags.length > 0) {
      resultItem.tags = $tags.map($tag => ($tag.textContent || ' ').slice(1))
    }

    resultItem.contributor = getText($panel, '.contributor')
    resultItem.thumbsUp = thumbsMap?.[defId]?.up
    resultItem.thumbsDown = thumbsMap?.[defId]?.down

    result.push(resultItem)
  }
  console.log('⚡️ line:179 ~ result: ', result)

  if (result.length > 0) {
    return { result, audio }
  }
  return handleNoResult()
}
