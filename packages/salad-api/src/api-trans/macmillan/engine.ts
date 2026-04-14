
import type { AtomGetSrcFunction } from '../../types/atom-type'
import type { MacmillanResult, MacmillanResultLex } from './type'
import {
  getInnerHTML,
  getText,
  getFullLink,
  getOuterHTML
} from '../../utils/dom-utils'
import { handleNoResult, handleNetWorkError } from '../../utils/error-response'

function removeChildren(parent: ParentNode, selector: string): void {
  parent.querySelectorAll(selector).forEach($el => $el.remove())
}

function removeChild(parent: ParentNode, selector: string): void {
  const $el = parent.querySelector(selector)
  if ($el) $el.remove()
}

function externalLink($a: HTMLAnchorElement): void {
  if ($a.getAttribute('href')) {
    $a.setAttribute('href', getFullLink(HOST, $a, 'href'))
  }
  $a.setAttribute('target', '_blank')
  $a.setAttribute('rel', 'noopener noreferrer')
}

async function fetchDirtyDOM(url: string): Promise<Document> {
  const res = await fetch(url)
  const domText = await res.text()
  const doc = new DOMParser().parseFromString(domText, 'text/html')
  removeChildren(doc, '.visible-xs')
  return doc
}

export type { MacmillanResult, MacmillanResultLex, MacmillanResultRelated, MacmillanPayload } from './type'

export const getSrcPage: AtomGetSrcFunction = (text, localLang, profile) => {
  const lang = 'american'
  //  : 'british'
  return (
    `http://www.macmillandictionary.com/dictionary/${lang}/` +
    encodeURIComponent(text.toLocaleLowerCase().replace(/[^A-Za-z0-9]+/g, '-'))
  )
}

const HOST = 'http://www.macmillandictionary.com'

interface MacmillanOptions {
  related: boolean
  locale: 'uk' | 'us'
}

type MacmillanSearchResult = {
  result: MacmillanResult
  audio?: { uk?: string }
}

interface SearchOpt {
  profile: {
    macmillan: { options: MacmillanOptions }
  } & Record<string, any>
  localLang?: 'zh-CN' | 'zh-TW' | 'en'
}

export const search = async (
  text: string,
  opt: SearchOpt
): Promise<MacmillanSearchResult> => {
  const options = opt.profile.macmillan.options

  return fetchMacmillanDom((await getSrcPage(text, opt.localLang || 'zh-CN', opt.profile as any)))
    .catch(handleNetWorkError)
    .then(doc => checkResult(doc, options))
}

async function checkResult (
  doc: Document,
  options: MacmillanOptions
): Promise<MacmillanSearchResult> {
  if (doc.querySelector('.senses')) {
    return handleDOM(doc)
  } else if (options.related) {
    const alternatives = [
      ...doc.querySelectorAll<HTMLAnchorElement>('.display-list li a'),
    ].map($a => ({
      title: getText($a),
      href: getFullLink(HOST, $a, 'href'),
    }))
    if (alternatives.length > 0) {
      return {
        result: {
          type: 'related',
          list: alternatives,
        },
      }
    }
  }
  return handleNoResult()
}

export function handleDOM (
  doc: Document
): MacmillanSearchResult | Promise<MacmillanSearchResult> {
  const $entry = doc.querySelector('#entryContent .left-content')
  if (!$entry) {
    return handleNoResult()
  }

  const result: MacmillanResultLex = {
    type: 'lex',
    title: getText($entry, '.big-title .BASE'),
    senses: '',
    toggleables: [],
    relatedEntries: [],
  }

  if (!result.title) {
    return handleNoResult()
  }

  $entry
    .querySelectorAll<HTMLAnchorElement>('a.moreButton')
    .forEach(externalLink)

  result.senses = getInnerHTML(HOST, $entry, '.senses')

  if (!result.senses) {
    return handleNoResult()
  }

  removeChild($entry, '.senses')

  result.pos = getText($entry, '.entry-pron-head .PART-OF-SPEECH')
  result.sc = getText($entry, '.entry-pron-head .SYNTAX-CODING')
  result.phsym = getText($entry, '.entry-pron-head .PRON')
  result.ratting = $entry.querySelectorAll('.entry-red-star').length

  $entry.querySelectorAll('.toggleable').forEach($toggleable => {
    result.toggleables.push(getOuterHTML(HOST, $toggleable))
  })

  doc
    .querySelectorAll<HTMLAnchorElement>('.related-entries-item a')
    .forEach($a => {
      const $pos = $a.querySelector('.PART-OF-SPEECH')
      if ($pos) {
        $pos.textContent = getText($pos).toUpperCase()
      }

      result.relatedEntries.push({
        title: getText($a),
        href: getFullLink(HOST, $a, 'href'),
      })
    })

  const audio: { uk?: string } = {}

  const $sound = $entry.querySelector<HTMLDivElement>(
    '.entry-pron-head .PRONS .sound'
  )
  if ($sound && $sound.dataset.srcMp3) {
    result.pron = $sound.dataset.srcMp3
    audio.uk = result.pron
  }

  return { result, audio }
}

async function fetchMacmillanDom (url: string): Promise<Document> {
  return fetchDirtyDOM(url)
}
