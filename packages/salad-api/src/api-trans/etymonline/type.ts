import type { HTMLString } from '../../types'

export interface EtymonlineResultItem {
  id: string
  title: string
  def: HTMLString
  href?: string
  chart?: string
}

export type EtymonlineResult = EtymonlineResultItem[]
