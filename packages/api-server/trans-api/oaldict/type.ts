import type { HTMLString } from '../../types'

interface Idiom {
  title?: string
  labels?: string
  def?: string
  examples?: HTMLString
}

interface Mean {
  symbols?: string
  grammar?: string
  labels?: string
  variants?: HTMLString
  variantsIsBlock?: boolean
  use?: string
  cf?: string
  def?: string
  examples?: HTMLString
}

interface Sense {
  title?: string
  symbol?: string
  variants?: string
  means: Mean[]
}

interface Ipron {
  uk: {
    sound?: string
    phon?: string
  }
  us: {
    sound?: string
    phon?: string
  }
}

interface OaldictResultItem {
  /** word */
  title: string
  pos?: string
  symbol?: string
  /** pronunciation */
  pron: Ipron
  /** sense and eg */
  senses: Sense[]
  origin?: HTMLString
  /** idiom and eg */
  idioms: Idiom[]
  /** phrasal template */
  isPhrasal?: boolean
}

export type OaldictResult = OaldictResultItem
