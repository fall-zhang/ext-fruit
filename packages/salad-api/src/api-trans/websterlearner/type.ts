import type { HTMLString } from '../../types/res-type'

export interface WebsterLearnerResultItem {
  title: HTMLString
  pron?: string

  infs?: HTMLString
  infsPron?: string

  labels?: HTMLString
  senses?: HTMLString
  phrases?: HTMLString
  derived?: HTMLString
  arts?: string[]
}

export interface WebsterLearnerResultLex {
  type: 'lex'
  items: WebsterLearnerResultItem[]
}

export interface WebsterLearnerResultRelated {
  type: 'related'
  list: HTMLString
}

export type WebsterLearnerResult =
  | WebsterLearnerResultLex
  | WebsterLearnerResultRelated
