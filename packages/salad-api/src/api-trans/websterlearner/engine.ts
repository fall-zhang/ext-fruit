
import type { AtomSearchResult } from '../../types/res-type'
import { getInnerHTML } from '../../utils/dom-utils'
import {
  handleNoResult
} from '../../utils/error-response'
import type {
  WebsterLearnerResult,
  WebsterLearnerResultItem,
  WebsterLearnerResultLex
} from './type'


const HOST = 'http://www.learnersdictionary.com'

type WebsterLearnerSearchResult = AtomSearchResult<WebsterLearnerResult>
type WebsterLearnerSearchResultLex = AtomSearchResult<WebsterLearnerResultLex>
export function handleDOM (
  doc: Document
): WebsterLearnerSearchResult | Promise<WebsterLearnerSearchResult> {
  const $alternative = doc.querySelector<HTMLAnchorElement>(
    '[id^="spelling"] .links'
  )
  if (!$alternative) {
    return handleDOMContent(doc)
  }
  return {
    result: {
      type: 'related',
      list: getInnerHTML(HOST, $alternative),
    },
  }
}

function handleDOMContent (
  doc: Document
): WebsterLearnerSearchResultLex | Promise<WebsterLearnerSearchResultLex> {
  doc.querySelectorAll('.d_hidden').forEach(el => el.remove())

  const result: WebsterLearnerResultLex = {
    type: 'lex',
    items: [],
  }
  const audio: { us?: string } = {}

  doc.querySelectorAll('.entry').forEach($entry => {
    const entry: WebsterLearnerResultItem = {
      title: '',
    }

    const $headword = $entry.querySelector('.hw_d')
    if (!$headword) {
      return
    }
    const $pron = $headword.querySelector<HTMLAnchorElement>('.play_pron')
    if ($pron) {
      const path = ($pron.dataset.lang || '').replace('_', '/')
      const dir = $pron.dataset.dir || ''
      const file = $pron.dataset.file || ''
      entry.pron = `http://media.merriam-webster.com/audio/prons/${path}/mp3/${dir}/${file}.mp3`
      audio.us = entry.pron
      $pron.remove()
    }
    entry.title = getInnerHTML(HOST, $headword)

    const $headwordInfs = $entry.querySelector('.hw_infs_d')
    if ($headwordInfs) {
      const $pron = $headwordInfs.querySelector<HTMLAnchorElement>('.play_pron')
      if ($pron) {
        const path = ($pron.dataset.lang || '').replace('_', '/')
        const dir = $pron.dataset.dir || ''
        const file = $pron.dataset.file || ''
        entry.infsPron = `http://media.merriam-webster.com/audio/prons/${path}/mp3/${dir}/${file}.mp3`
        $pron.remove()
      }
      entry.infs = getInnerHTML(HOST, $headwordInfs)
    }

    entry.labels = getInnerHTML(HOST, $entry, '.labels')

    // if (options.defs) {
    entry.senses = getInnerHTML(HOST, $entry, '.sblocks')

    // if (options.phrase) {
    entry.phrases = getInnerHTML(HOST, $entry, '.dros')

    // if (options.derived) {
    entry.derived = getInnerHTML(HOST, $entry, '.uros')

    // if (options.arts) {
    entry.arts = Array.from(
      $entry.querySelectorAll<HTMLImageElement>('.arts img')
    ).map($img => $img.src)

    if (
      entry.senses ||
      entry.phrases ||
      entry.derived ||
      (entry.arts && entry.arts.length > 0)
    ) {
      result.items.push(entry)
    }
  })

  if (result.items.length > 0) {
    return { result, audio }
  }

  return handleNoResult()
}
