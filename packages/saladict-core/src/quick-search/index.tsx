import './env'
import '@/selection'

import React, { FC } from 'react'
import { Helmet } from 'react-helmet'
import { message, storage } from '@/_helpers/browser-api'

import { Provider as ProviderRedux } from 'react-redux'
import { createStore } from '@/content/redux'

import { I18nContextProvider, useTranslate } from '@/_helpers/i18n'

import { DictPanelStandaloneContainer } from '@/content/components/DictPanel/DictPanelStandalone.container'

import './quick-search.scss'
import { createRoot } from 'react-dom/client'

document.title = 'Saladict Standalone Panel'

const Title: FC = () => {
  const { t } = useTranslate('content')
  return (
    <Helmet>
      <title>{t('standalone')}</title>
    </Helmet>
  )
}

createStore().then(store => {
  const root = createRoot(document.getElementById('root')!)
  root.render(<I18nContextProvider>
    <Title />
    <ProviderRedux store={store}>
      <DictPanelStandaloneContainer width="100vw" height="100vh" />
    </ProviderRedux>
  </I18nContextProvider>)

  // Firefox cannot fire 'unload' event.
  window.addEventListener('beforeunload', () => {
    message.send({ type: 'CLOSE_QS_PANEL' })

    if (!store.getState().config.qssaSidebar) {
      storage.local.set({
        qssaRect: {
          top: window.screenY,
          left: window.screenX,
          width: window.outerWidth,
          height: window.outerHeight
        }
      })
    }
  })
})
