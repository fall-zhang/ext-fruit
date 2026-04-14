
import type { WikipediaSearchResult, LangListItem } from './type'
import {
  handleNoResult,
  getOuterHTML,
  getText,
  getFullLink
} from '../../utils/dom-utils'

export function fetchLangList(langSelector: string) {
  return import('../../utils/fetch-dom')
    .then(({ fetchDirtyDOM }) => fetchDirtyDOM(langSelector))
    .then(getLangList)
    .catch((e: unknown) => {
      console.error('Dict wikipedia: fetch langList failed', e)
      return []
    })
}

export function handleDOM(
  doc: Document,
  subdomain: string
): WikipediaSearchResult | Promise<WikipediaSearchResult> {
  const $bs = [...doc.querySelectorAll('#mf-section-0 b')]
  if (
    $bs.some($b => {
      const textContent = $b.textContent
      return (
        textContent === 'The article that you\'re looking for doesn\'t exist.' ||
        textContent === '维基百科目前还没有与上述标题相同的条目。'
      )
    })
  ) {
    return handleNoResult<WikipediaSearchResult>()
  }

  const title = getText(doc, '#section_0')
  if (!title) {
    return handleNoResult<WikipediaSearchResult>()
  }

  doc.querySelectorAll('#bodyContent .section-heading').forEach($header => {
    $header.classList.add('collapsible-heading')
    $header.setAttribute('role', 'button')
    const $icon = $header.querySelector('.mw-ui-icon')
    if ($icon) {
      $icon.classList.add('mw-ui-icon-mf-arrow')
      $icon.classList.remove('mf-mw-ui-icon-rotate-flip')
    }
  })

  const content = getOuterHTML(`https://${subdomain}.wikipedia.org/`, doc, {
    selector: '#bodyContent',
    config: {},
  })
  if (!content) {
    return handleNoResult<WikipediaSearchResult>()
  }

  let langSelector = ''
  let $langSelector = doc.querySelector('a.language-selector')
  if (!$langSelector) {
    $langSelector = doc.querySelector('.language-selector a')
  }
  if ($langSelector) {
    langSelector = getFullLink(
      `https://${subdomain}.m.wikipedia.org/`,
      $langSelector,
      'href'
    )
  }

  return { result: { title, content, langSelector } }
}

function getLangList(doc: Document): LangListItem[] {
  return [...doc.querySelectorAll('#mw-content-text li a')]
    .map<LangListItem | undefined>($a => {
      const url = $a.getAttribute('href')
      const title = $a.getAttribute('title')
      if (url && title) {
        return { url, title }
      }
      return undefined
    })
    .filter((x): x is LangListItem => !!x)
}
