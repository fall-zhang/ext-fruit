/** @see https://github.com/audreyt/moedict-webkit#4-國語-a */
export interface GuoYuResult {
  n: number
  /** Title */
  t: string
  r: string
  c: number
  h?: Array<{
    /** Definitions */
    d: Array<{
      /** Title */
      type: string
      /** Meaning */
      f: string
      /** Homophones */
      l?: string[]
      /** Examples */
      e?: string[]
      /** Quotes */
      q?: string[]
    }>
    /** Pinyin */
    p: string
    /** Audio ID */
    '='?: string
  }>
  translation?: {
    francais?: string[]
    Deutsch?: string[]
    English?: string[]
  }
}
