import type { FC, ReactNode } from 'react'
import './_style.scss'
import { SearchProvider } from '@/context/search-context'
import { SaladContent } from './salad-context'
import type { SaladConfigType } from '@/config/app-config/config-type'
import { useConfContext } from '@/context/conf-context'
import { TooltipProvider } from '@P/ui/components/tooltip'

type SaladPanelProps = {
  customButton?: ReactNode
  config?: SaladConfigType
}

export const SaladPanel: FC<SaladPanelProps> = (props) => {
  const configContext = useConfContext()
  return (
    <SearchProvider profile={configContext.profile}>
      <TooltipProvider>
        <SaladContent {...props} />
      </TooltipProvider>
    </SearchProvider>
  )
}
