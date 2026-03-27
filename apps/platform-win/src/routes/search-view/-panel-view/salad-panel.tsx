import type { FC, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import './_style.scss'
import i18n from '@/locales/i18n'
import { SearchProvider } from '@/context/search-context'
import { SaladContent } from './salad-context'
import type { SaladConfigType } from '@/config/app-config/config-type'
import { useConfContext } from '@/context/conf-context'

type SaladPanelProps = {
  customButton?: ReactNode
  config?: SaladConfigType
}

export const SaladPanel: FC<SaladPanelProps> = (props) => {
  const configContext = useConfContext()
  return (
    <SearchProvider profile={configContext.profile}>
      <SaladContent {...props} />
    </SearchProvider>
  )
}
