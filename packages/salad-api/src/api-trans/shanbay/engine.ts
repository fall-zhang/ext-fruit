
import {
  getText,
  getInnerHTML
} from '../../utils/dom-utils'
import type { ShanbayResult, ShanbaySearchResult } from './type'
import { handleNoResult } from '../../utils/error-response'

const HOST = 'https://www.shanbay.com'

export function handleDOM(doc: Document): ShanbaySearchResult | Promise<ShanbaySearchResult> {
  const $typo = doc.querySelector('.error-typo')
  if ($typo) {
    return handleNoResult()
  }
  return handleLexicon(doc)
}

async function handleLexicon(doc: Document): Promise<ShanbaySearchResult> {
  const word = doc.querySelector('.word-spell')
  const title = getText(doc, '.word-spell')
  const pattern = getText(doc, '.pattern')

  if (!title) {
    return handleNoResult()
  }

  const result: ShanbayResult = {
    id: 'shanbay',
    type: 'lex',
    title,
    pattern,
    prons: [],
    sentences: [],
  }

  const audio: { uk: string; us: string } = {
    uk: 'http://media.shanbay.com/audio/uk/' + result.title + '.mp3',
    us: 'http://media.shanbay.com/audio/us/' + result.title + '.mp3',
  }

  result.prons.push({
    phsym: getText(doc, '.word-announace'),
    url: audio.us,
  })

  result.basic = getInnerHTML(HOST, doc, '.definition-cn')

  result.wordId = word && word.getAttribute('data-id')

  return { result, audio }
}
