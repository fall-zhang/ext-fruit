
/** Lexical result */
export interface BingResultLex {
  type: 'lex'
  title: string
  /** phonetic symbols */
  phsym?: Array<{
    /** Phonetic Alphabet, UK|US|PY */
    lang: string
    /** pronunciation */
    pron: string
  }>
  /** common definitions */
  cdef?: Array<{
    /** part of speech */
    pos: string
    /** definition */
    def: string
  }>
  /** infinitive */
  infs?: string[]
  sentences?: Array<{
    en?: string
    chs?: string
    source?: string
    mp3?: string
  }>
}

/** Alternate machine translation result */
export interface BingResultMachine {
  type: 'machine'
  /** machine translation */
  mt: string
}

/** Alternate result */
export interface BingResultRelated {
  type: 'related'
  title: string
  defs: Array<{
    title: string
    meanings: Array<{
      href: string
      word: string
      def: string
    }>
  }>
}

export type BingResult = BingResultLex | BingResultMachine | BingResultRelated
