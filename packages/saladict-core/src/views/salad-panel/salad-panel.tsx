import type { CSSProperties, FC, ReactNode } from 'react'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { SALADICT_PANEL } from '../../core/saladict-state'
import { MenuBar } from './MenuBar/MenuBar'
import { useConfContext } from '../../context/conf-context'
import { DictList } from './DictList/DictList'
import { I18nextProvider } from 'react-i18next'
import './_style.scss'
import i18n from '../../locales/i18n'
import { debounce } from 'es-toolkit'
import { newWord } from '../../dict-utils/new-word'
import { SearchBox } from './search-input/search-input'
import { SearchProvider, useSearchContext } from '../../context/search-context'
import { useStore } from 'zustand'
import { SaladContent } from './salad-context'

type SaladPanelProps = {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode
  customFetch?(input: URL | Request | string, init?: RequestInit): Promise<Response>;
}

export const SaladPanel: FC<SaladPanelProps> = (props) => {
  return (<I18nextProvider i18n={i18n}>
    <SearchProvider customFetch={props.customFetch}>
      <SaladContent {...props} />
    </SearchProvider>
  </I18nextProvider>
  )
}
