import DOMPurify from 'dompurify'
import type { Config } from 'dompurify'
import { isTagName } from './is-tag-name'
import chsToChz from './chs-to-chz'

export function handleNoResult<T = any> (): Promise<T> {
  return Promise.reject(new Error('NO_RESULT'))
}

export function handleNetWorkError (): Promise<never> {
  return Promise.reject(new Error('NETWORK_ERROR'))
}

/**
 * Get chs-chz transform function on-demand.
 * The dict object is huge.
 *
 * 将简体中文，翻译成繁体中文
 * @param langCode
 */
export function getChsToChz (langCode: string): null | ((text: string) => string) {
  return ['zh-TW', 'zh-HK'].includes(langCode)
    ? chsToChz
    : null
}

/**
 * Get the textContent of a node or its child.
 */
export function getText (
  parent: ParentNode | null,
  selector?: string,
  transform?: null | ((text: string) => string)
): string
export function getText (
  parent: ParentNode | null,
  ...args:
    | [string?, (null | ((text: string) => string))?] |
    [(null | ((text: string) => string))?, string?]
): string {
  if (!parent) {
    return ''
  }

  let selector = ''
  let transform: null | ((text: string) => string) = null
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'string') {
      selector = args[i] as string
    } else if (typeof args[i] === 'function') {
      transform = args[i] as (text: string) => string
    }
  }

  const child = selector
    ? parent.querySelector(selector)
    : (parent as HTMLElement)
  if (!child) {
    return ''
  }

  const textContent = child.textContent || ''
  return transform ? transform(textContent) : textContent
}

export interface GetHTMLConfig {
  /** innerHTML or outerHTML */
  mode?: 'innerHTML' | 'outerHTML'
  /** Select child node */
  selector?: string
  /** transform text */
  transform?: null | ((text: string) => string)
  /** Give url and src a host */
  host?: string
  /** DOM Purify config */
  config?: Config
}

const defaultDOMPurifyConfig: Config = {
  FORBID_TAGS: ['style'],
  FORBID_ATTR: ['style'],
}

export function getHTML (
  parent: ParentNode,
  {
    mode = 'innerHTML',
    selector,
    transform,
    host,
    config = defaultDOMPurifyConfig,
  }: GetHTMLConfig = {}
): string {
  const node = selector
    ? parent.querySelector<HTMLElement>(selector)
    : (parent as HTMLElement)
  if (!node) {
    return ''
  }

  if (host) {
    const fillLink = (el: HTMLElement) => {
      if (el.getAttribute('href')) {
        el.setAttribute('href', getFullLink(host!, el, 'href'))
      }
      if (el.getAttribute('src')) {
        el.setAttribute('src', getFullLink(host!, el, 'src'))
      }
      if (el.getAttribute('srcset')) {
        el.setAttribute(
          'srcset',
          el
            .getAttribute('srcset')!
            .replace(/(,| |^)\/\//g, (_, head) => head + 'https://')
        )
      }
    }

    if (isTagName(node, 'a') || isTagName(node, 'img')) {
      fillLink(node)
    }
    node.querySelectorAll('a').forEach(fillLink)
    node.querySelectorAll('img').forEach(fillLink)
  }

  const fragment = DOMPurify.sanitize(node, {
    ...config,
    RETURN_DOM_FRAGMENT: true,
  })

  const content = fragment.firstChild ? fragment.firstChild[mode] : ''

  return transform ? transform(content) : content
}

export function getInnerHTML (
  host: string,
  parent: ParentNode,
  selectorOrConfig: string | Omit<GetHTMLConfig, 'mode' | 'host'> = {}
) {
  return getHTML(
    parent,
    typeof selectorOrConfig === 'string'
      ? { selector: selectorOrConfig, host, mode: 'innerHTML' }
      : { ...selectorOrConfig, host, mode: 'innerHTML' }
  )
}

export function getOuterHTML (
  host: string,
  parent: ParentNode,
  selectorOrConfig: string | Omit<GetHTMLConfig, 'mode' | 'host'> = {}
) {
  return getHTML(
    parent,
    typeof selectorOrConfig === 'string'
      ? { selector: selectorOrConfig, host, mode: 'outerHTML' }
      : { ...selectorOrConfig, host, mode: 'outerHTML' }
  )
}

/**
 * Remove a child node from a parent node
 */
export function removeChild (parent: ParentNode, selector: string) {
  const child = parent.querySelector(selector)
  if (child) {
    child.remove()
  }
}

/**
 * Remove all the matching child nodes from a parent node
 */
export function removeChildren (parent: ParentNode, selector: string) {
  parent.querySelectorAll(selector).forEach(el => el.remove())
}

/**
 * HEX string to normal string
 */
export function decodeHEX (text: string): string {
  return text.replace(/\\x([0-9A-Fa-f]{2})/g, (m, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  )
}

/**
 * Will jump to the website instead of searching
 * when clicking on the dict panel
 */
export function externalLink ($a: HTMLElement) {
  $a.setAttribute('target', '_blank')
  $a.setAttribute('rel', 'nofollow noopener noreferrer')
}

export function getFullLink (hostStr: string, el: Element, attr: string): string {
  let host = hostStr
  if (host.endsWith('/')) {
    host = host.slice(0, -1)
  }

  const protocol = host.startsWith('https') ? 'https:' : 'http:'

  const link = el.getAttribute(attr)
  if (!link) {
    return ''
  }

  if (/^[a-zA-Z0-9]+:/.test(link)) {
    return link
  }

  if (link.startsWith('//')) {
    return protocol + link
  }

  if (/^.?\/+/.test(link)) {
    return host + '/' + link.replace(/^.?\/+/, '')
  }

  return host + '/' + link
}
