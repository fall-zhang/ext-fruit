import './env'

import { Provider as ProviderRedux } from 'react-redux'
import { createStore } from '@/content/redux'

import { I18nContextProvider } from '@/_helpers/i18n'

import { WordEditorStandaloneContainer } from '@/content/components/WordEditor/WordEditorStandalone.container'

import './word-editor.scss'
import { createRoot } from 'react-dom/client'

document.title = 'Saladict Word Editor'

createStore().then(store => {
  const searchParams = new URL(document.URL).searchParams

  const wordString = searchParams.get('word')
  if (wordString) {
    try {
      const word = JSON.parse(decodeURIComponent(wordString))
      if (word) {
        store.dispatch({
          type: 'WORD_EDITOR_STATUS',
          payload: { word, translateCtx: true }
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }
  const root = createRoot(document.getElementById('root')!)
  root.render(<I18nContextProvider>
    <ProviderRedux store={store}>
      <WordEditorStandaloneContainer />
    </ProviderRedux>
  </I18nContextProvider>)
})
