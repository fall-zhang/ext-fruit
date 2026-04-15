import {
  handleNoResult,
  getText,
  getInnerHTML,
  getChsToChz
} from '@/core/api-server/utils'
import type { BingResult, BingResultLex, BingResultMachine } from './type'
import type { AtomSearchResult } from '../../types/res-type'
import type { ApiInfo } from '../../types/api-info'

const HOST = 'https://cn.bing.com'

// const DICT_LINK =
//   'https://cn.bing.com/dict/clientsearch?mkt=zh-CN&setLang=zh&form=BDVEHC&ClientVer=BDDTV3.5.1.4320&q='
const SENTENCE_COUNT = 5


type BingConfig = ApiInfo

type BingSearchResultLex = AtomSearchResult<BingResultLex>
type BingSearchResultMachine = AtomSearchResult<BingResultMachine>
// type BingSearchResultRelated = AtomSearchResult<BingResultRelated>

// export const getSearchURL = (word: string) => {
//   return DICT_LINK + encodeURIComponent(word.replace(/\s+/g, ' '))
// }

// export const search: SearchFunction<BingResult> = async (text, opt) => {
//   return fetchDirtyDOM(
//     DICT_LINK + encodeURIComponent(text.replace(/\s+/g, ' '))
//   )
//     .then(async doc => {
//       return handleDOM(doc, { profile: opt.profile, localLang: opt.localLang || '' })
//     })
//     .catch(handleNetWorkError)
// }

export function handleDOM (
  doc: Document,
  context: { localLang: 'en' | 'zh-CN' | 'zh-TW' }
): AtomSearchResult<BingResult> | Promise<AtomSearchResult<BingResult>> {
  // const bingConfig = context.profile
  // const transform = getChsToChz(context.localLang)

  if (doc.querySelector('.client_def_hd_hd')) {
    return handleLexResult(doc)
  }

  if (doc.querySelector('.client_trans_head')) {
    return handleMachineResult(doc)
  }

  return handleNoResult()
}

function handleLexResult (
  doc: Document
): BingSearchResultLex | Promise<BingSearchResultLex> {
  const searchResult: AtomSearchResult<BingResultLex> = {
    result: {
      type: 'lex',
      title: getText(doc, '.client_def_hd_hd'),
    },
  }

  // pronunciation
  // if (options.phsym) {
  const $prons = Array.from(doc.querySelectorAll('.client_def_hd_pn_list'))
  if ($prons.length > 0) {
    searchResult.result.phsym = $prons.map(el => {
      let pron = ''
      const $audio = el.querySelector('.client_aud_o')
      if ($audio) {
        pron = (($audio.getAttribute('onclick') || '').match(
          /https.*\.mp3/
        ) || [''])[0]
      }
      return {
        lang: getText(el, '.client_def_hd_pn'),
        pron,
      }
    })

    searchResult.audio = searchResult.result.phsym.reduce(
      (audio, { lang, pron }) => {
        const newAudio = { ...audio }
        if (/us|美/i.test(lang)) {
          newAudio.us = pron
        } else if (/uk|英/i.test(lang)) {
          newAudio.uk = pron
        }
        return newAudio
      },
      {
        us: '',
        uk: '',
      }
    )
  }
  // }

  // definitions
  // if (options.cdef) {
  const $container = doc.querySelector('.client_def_container')
  if ($container) {
    const $defs = Array.from($container.querySelectorAll('.client_def_bar'))
    if ($defs.length > 0) {
      searchResult.result.cdef = $defs.map(el => ({
        pos: getText(el, '.client_def_title_bar'),
        def: getText(el, '.client_def_list'),
      }))
    }
  }
  // }

  // tense
  // if (options.tense) {
  const $infs = Array.from(doc.querySelectorAll('.client_word_change_word'))
  if ($infs.length > 0) {
    searchResult.result.infs = $infs.map(el => (el.textContent || '').trim())
  }
  // }

  // if (options.sentence > 0) {
  const $sens = doc.querySelectorAll('.client_sentence_list')
  const sentences: typeof searchResult.result.sentences = []
  for (
    let i = 0;
    i < $sens.length && sentences.length < SENTENCE_COUNT;
    i++
  ) {
    const el = $sens[i]
    let mp3 = ''
    const $audio = el.querySelector('.client_aud_o')
    if ($audio) {
      mp3 = (($audio.getAttribute('onclick') || '').match(/https.*\.mp3/) || [
        '',
      ])[0]
    }
    el.querySelectorAll('.client_sen_en_word').forEach($word => {
      // eslint-disable-next-line no-param-reassign
      $word.outerHTML = getText($word)
    })
    el.querySelectorAll('.client_sen_cn_word').forEach($word => {
      // eslint-disable-next-line no-param-reassign
      $word.outerHTML = getText($word)
    })
    el.querySelectorAll('.client_sentence_search').forEach($word => {
      // eslint-disable-next-line no-param-reassign
      $word.outerHTML = `<span class="dictBing-SentenceItem_HL">${getText(
        $word
      )}</span>`
    })
    sentences.push({
      en: getInnerHTML(HOST, el, '.client_sen_en'),
      chs: getInnerHTML(HOST, el, {
        selector: '.client_sen_cn',
      }),
      source: getText(el, '.client_sentence_list_link'),
      mp3,
    })
  }
  searchResult.result.sentences = sentences
  // }

  if (Object.keys(searchResult.result).length > 2) {
    return searchResult
  }
  return handleNoResult()
}

function handleMachineResult (
  doc: Document
): BingSearchResultMachine | Promise<BingSearchResultMachine> {
  const mt = getText(doc, '.client_sen_cn')

  if (mt) {
    return {
      result: {
        type: 'machine',
        mt,
      },
    }
  }

  return handleNoResult()
}

