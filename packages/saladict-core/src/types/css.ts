
import type { CSSProperties } from 'react'

export type GlobalCssVar = CSSProperties & {
  '--panel-width'?: string
  '--panel-max-height'?: string
  '--panel-font-size'?: string
  '--color-brand'?: string
  '--color-font'?: string
  '--color-background'?: string
  '--color-rgb-background' ?: string
  '--color-divider'?: string
}


const cssE:GlobalCssVar = {
  '--color-background': 'mage',
}


