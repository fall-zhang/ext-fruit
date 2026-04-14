import type { HTMLString } from '../../types'

export interface LexicoResultLex {
  type: 'lex'
  entry: HTMLString
}

export interface LexicoResultRelated {
  type: 'related'
  list: ReadonlyArray<{
    href: string
    text: string
  }>
}

export type LexicoResult = LexicoResultLex | LexicoResultRelated
