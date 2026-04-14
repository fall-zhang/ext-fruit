import DOMPurify from 'dompurify'
import type { Config } from 'dompurify'

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

/**
 * xhtml returns small case
 * DOM 是否为该 tag 名称
 * @param node DOM
 * @param tagName string
 * @returns DOM 是否为该 tag 名称
 */
export function isTagName (node: Node, tagName: string): boolean {
  return (
    ((node as HTMLElement).tagName || '').toLowerCase() ===
    tagName.toLowerCase()
  )
}

const defaultDOMPurifyConfig: Config = {
  FORBID_TAGS: ['style'],
  FORBID_ATTR: ['style'],
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
  const content = fragment.firstElementChild ? fragment.firstElementChild?.[mode] : ''

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
