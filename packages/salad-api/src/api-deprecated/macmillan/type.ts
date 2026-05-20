import type { HTMLString } from '../../types/res-type'

export interface MacmillanResultLex {
  type: 'lex'
  title: string
  senses: HTMLString
  /** part of speech */
  pos?: string
  /** syntax coding */
  sc?: string
  phsym?: string
  pron?: string
  ratting?: number
  toggleables: HTMLString[]
  relatedEntries: Array<{
    title: string
    href: string
  }>
}

export interface MacmillanResultRelated {
  type: 'related'
  list: Array<{
    title: string
    href: string
  }>
}

export type MacmillanResult = MacmillanResultLex | MacmillanResultRelated

export interface MacmillanPayload {
  href?: string
}
