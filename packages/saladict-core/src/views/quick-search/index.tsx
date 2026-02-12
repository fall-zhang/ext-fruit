import './env'
import '@/selection'

import type { FC } from 'react'

import './quick-search.scss'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import DictPanelStandaloneContainer from '../DictPanel/DictPanelStandalone.container'

document.title = 'Saladict Standalone Panel'

const Title: FC = () => {
  const { t } = useTranslation('content')
  return (
    <title>{t('standalone')}</title>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<>
  <Title />
  <DictPanelStandaloneContainer width="100vw" height="100vh" />
</>)
