import type { HTMLString } from '../../types/res-type'

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

export type COBUILDResult = COBUILDColResult
