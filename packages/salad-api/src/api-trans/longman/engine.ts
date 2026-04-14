
import type { AtomSearchResult } from '../../types/res-type'
import type { LongmanResult, LongmanResultLex, LongmanResultRelated, LongmanResultEntry } from './type'
import {
  getText,
  getInnerHTML,
  handleNoResult,
  handleNetWorkError,
  getFullLink
} from '../../utils/dom-utils'
import { getStaticSpeaker } from '@/components/Speaker'
import type { AllDictsConf } from '../../config'

const HOST = 'https://www.ldoceonline.com'

type LongmanSearchResult = AtomSearchResult<LongmanResult>
type LongmanSearchResultLex = AtomSearchResult<LongmanResultLex>
type LongmanSearchResultRelated = AtomSearchResult<LongmanResultRelated>

export function handleDOM(
  doc: Document,
  options: AllDictsConf['longman']['options']
): LongmanSearchResult | Promise<LongmanSearchResult> {
  if (doc.querySelector('.dictentry')) {
    return handleDOMLex(doc, options)
  } else if (options.related) {
    return handleDOMRelated(doc)
  }
  return handleNoResult()
}

function handleDOMLex(
  doc: Document,
  options: AllDictsConf['longman']['options']
): LongmanSearchResultLex | Promise<LongmanSearchResultLex> {
  const result: LongmanResultLex = {
    type: 'lex',
    bussinessFirst: options.bussinessFirst,
    contemporary: [],
    bussiness: [],
  }

  const audio: { uk?: string; us?: string } = {}

  doc
    .querySelectorAll<HTMLSpanElement>('.speaker.exafile')
    .forEach($speaker => {
      const mp3 = $speaker.dataset.srcMp3
      if (mp3) {
        const parent = $speaker.parentElement
        $speaker.replaceWith(getStaticSpeaker(mp3))
        if (parent && parent.classList.contains('EXAMPLE')) {
          parent.classList.add('withSpeaker')
        }
      }
    })

  if (options.wordfams) {
    result.wordfams = getInnerHTML(HOST, doc, '.wordfams')
  }

  const $dictentries = doc.querySelectorAll('.dictentry')
  let currentDict: 'contemporary' | 'bussiness' | '' = ''
  for (let i = 0; i < $dictentries.length; i++) {
    const $entry = $dictentries[i]
    const $intro = $entry.querySelector('.dictionary_intro')
    if ($intro) {
      const dict = $intro.textContent || ''
      if (dict.includes('Contemporary')) {
        currentDict = 'contemporary'
      } else if (dict.includes('Business')) {
        currentDict = 'bussiness'
      } else {
        currentDict = ''
      }
    }

    if (!currentDict) {
      continue
    }

    const entry: LongmanResultEntry = {
      title: {
        HWD: '',
        HYPHENATION: '',
        HOMNUM: '',
      },
      prons: [],
      senses: [],
    }

    const $topic = $entry.querySelector<HTMLAnchorElement>('a.topic')
    if ($topic) {
      entry.topic = {
        title: $topic.textContent || '',
        href: getFullLink(HOST, $topic, 'href'),
      }
    }

    const $head = $entry.querySelector('.Head')
    if (!$head) {
      continue
    }

    entry.title.HWD = getText($head, '.HWD')
    entry.title.HYPHENATION = getText($head, '.HYPHENATION')
    entry.title.HOMNUM = getText($head, '.HOMNUM')

    entry.phsym = getText($head, '.PronCodes')

    const $level = $head.querySelector('.LEVEL') as HTMLSpanElement
    if ($level) {
      const level = {
        rate: 0,
        title: '',
      }

      level.rate = (($level.textContent || '').match(/●/g) || []).length
      level.title = $level.title

      entry.level = level
    }

    entry.freq = Array.from(
      $head.querySelectorAll<HTMLSpanElement>('.FREQ')
    ).map($el => ({
      title: $el.title,
      rank: $el.textContent || '',
    }))

    entry.pos = getText($head, '.POS')

    $head.querySelectorAll<HTMLSpanElement>('.speaker').forEach($pron => {
      let lang: 'us' | 'uk' = 'us'
      const title = $pron.title
      if (title.includes('British')) {
        lang = 'uk'
      }
      const pron = $pron.getAttribute('data-src-mp3') || ''

      audio[lang] = pron
      entry.prons.push({ lang, pron })
    })

    entry.senses = Array.from($entry.querySelectorAll('.Sense')).map($sen =>
      getInnerHTML(HOST, $sen)
    )

    if (options.collocations) {
      entry.collocations = getInnerHTML(HOST, $entry, '.ColloBox')
    }

    if (options.grammar) {
      entry.grammar = getInnerHTML(HOST, $entry, '.GramBox')
    }

    if (options.thesaurus) {
      entry.thesaurus = getInnerHTML(HOST, $entry, '.ThesBox')
    }

    if (options.examples) {
      entry.examples = Array.from(
        $entry.querySelectorAll('.exaGroup')
      ).map($exa => getInnerHTML(HOST, $exa))
    }

    result[currentDict].push(entry)
  }

  if (result.contemporary.length <= 0 && result.bussiness.length <= 0) {
    return handleNoResult()
  }

  return { result, audio }
}

function handleDOMRelated(
  doc: Document
): LongmanSearchResultRelated | Promise<LongmanSearchResultRelated> {
  const $didyoumean = doc.querySelector('.didyoumean')
  if ($didyoumean) {
    return {
      result: {
        type: 'related',
        list: getInnerHTML(HOST, $didyoumean),
      },
    }
  }
  return handleNoResult()
}
