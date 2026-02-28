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
