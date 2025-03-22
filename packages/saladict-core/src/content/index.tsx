import { createRoot } from 'react-dom/client'
import { Provider as ProviderRedux } from 'react-redux'
import SaladBowlContainer from './components/SaladBowl/SaladBowl.container'
import DictPanelContainer from './components/DictPanel/DictPanel.container'
import WordEditorContainer from './components/WordEditor/WordEditor.container'
import { createStore } from './redux/index'

import { I18nContextProvider } from '@/_helpers/i18n'

import './_style.scss'

// Only load on top frame
if (window.parent === window && !window.__SALADICT_PANEL_LOADED__) {
  window.__SALADICT_PANEL_LOADED__ = true

  ContentPage()
}

export async function ContentPage () {
  const store = await createStore()
  const App = () => (
    <ProviderRedux store={store}>
      <I18nContextProvider>
        <SaladBowlContainer />
        <DictPanelContainer />
        <WordEditorContainer />
      </I18nContextProvider>
    </ProviderRedux>
  )
  const root = createRoot(document.createElement('div'))
  root.render(<App />)
}
