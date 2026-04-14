import type { HTMLString } from '../../types'

export type WeblioResultItem = {
  title: HTMLString
  def: HTMLString
}

export type WeblioResult = WeblioResultItem[]
