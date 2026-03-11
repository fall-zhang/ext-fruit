
import {
  getText,
  getInnerHTML,
  handleNoResult,
  handleNetWorkError
} from '../../utils'
import axios from 'axios'
import DOMPurify from 'dompurify'
import type { GetSrcPageFunction, DictSearchResult, SearchFunction } from '../../api-common/search-type'
import type { HTMLString } from '../../types'
import type { AllDictsConf } from '../../types/all-dict-conf'
import { fetchDirtyDOM } from '../../utils/fetch-dom'
import type { ShanbayResult, ShanbaySearchResult } from './type'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://www.shanbay.com/bdc/mobile/preview/word?word=${text}`
}

const HOST = 'http://www.shanbay.com'

/**
 * ！！！！！！！！！！！！！！！！
 * Disable
 * 当前翻译暂时不可用
 * @param text
 * @returns
 * ！！！！！！！！！！！！！！！！
 */
export const search: SearchFunction<ShanbayResult> = async (
  text,
  opt
) => {
  const options = opt.profile.shanbay.options
  return fetchDirtyDOM(
    'https://www.shanbay.com/bdc/mobile/preview/word?word=' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(doc => checkResult(doc, options))
}

function checkResult (
  doc: Document,
  options: AllDictsConf['shanbay']['options']
): ShanbaySearchResult | Promise<ShanbaySearchResult> {
  const $typo = doc.querySelector('.error-typo')
  if (!$typo) {
    return handleDOM(doc, options)
  }
  return handleNoResult()
}

function loadSentences (id: string) {
  return axios
    .get(
      `https://www.shanbay.com/api/v1/bdc/example/?vocabulary_id=${id}&type=sys`
    )
    .then(({ data: { data } }) => {
      if (Array.isArray(data)) {
        return data.map(
          (sentence: { annotation: string; translation: string }) => {
            return {
              annotation: DOMPurify.sanitize(sentence.annotation),
              translation: DOMPurify.sanitize(sentence.translation),
            }
          }
        )
      }
      return []
    })
}

async function handleDOM (
  doc: Document,
  options: AllDictsConf['shanbay']['options']
): Promise<ShanbaySearchResult> {
  const word = doc.querySelector('.word-spell')
  const result: ShanbayResult = {
    id: 'shanbay',
    type: 'lex',
    title: getText(doc, '.word-spell'),
    pattern: getText(doc, '.pattern'),
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

  if (options.basic) {
    result.basic = getInnerHTML(HOST, doc, '.definition-cn')
  }

  result.wordId = word && word.getAttribute('data-id')
  if (options.sentence && result.wordId) {
    result.sentences = await loadSentences(result.wordId)
  }

  if (result.title) {
    return { result, audio }
  }

  return handleNoResult()
}
