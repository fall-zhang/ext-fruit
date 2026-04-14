import type { HTMLString } from '../../types/res-type'

export interface COBUILDCibaResult {
  type: 'ciba'
  title: string
  defs: HTMLString[]
  level?: string
  star?: number
  prons?: Array<{
    phsym: string
    audio: string
  }>
}

export interface COBUILDSection {
  id: string
  className: string
  type: string
  title: string
  num: string
  content: HTMLString
}

export interface COBUILDColResult {
  type: 'collins'
  sections: COBUILDSection[]
}

export type COBUILDResult = COBUILDCibaResult | COBUILDColResult
