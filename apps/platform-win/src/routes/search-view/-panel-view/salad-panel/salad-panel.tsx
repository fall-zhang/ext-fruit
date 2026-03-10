import type { FC, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import './_style.scss'
import i18n from '@/locales/i18n'
import { SearchProvider } from '@/context/search-context'
import { SaladContent } from './salad-context'
import type { SaladConfigType } from '@/config/app-config/config-type'

type SaladPanelProps = {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode
  customFetch?(input: URL | Request | string, init?: RequestInit): Promise<Response>;
  onSearchChange: (text: string) => void
  config?: SaladConfigType
}

export const SaladPanel: FC<SaladPanelProps> = (props) => {
  return (<I18nextProvider i18n={i18n}>
    <SearchProvider customFetch={props.customFetch}>
      <SaladContent {...props} />
    </SearchProvider>
  </I18nextProvider>
  )
}
