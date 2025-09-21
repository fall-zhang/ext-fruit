import { createRoot } from 'react-dom/client'
import {SaladBowlContainer} from './SaladBowl/SaladBowl.container'
import {DictPanelPortalContainer} from './DictPanel/DictPanel.container'
import WordEditorContainer from './word-editor/WordEditor/WordEditor.container'

// import { I18nContextProvider } from '@/_helpers/i18n'
import { I18nContextProvider } from '../../locales/i18n'

import './_style.scss'

export async function ContentPage () {
  const App = () => (
    <I18nContextProvider>
      <SaladBowlContainer />
      <DictPanelPortalContainer />
      <WordEditorContainer />
    </I18nContextProvider>
  )
  const root = createRoot(document.createElement('div'))
  root.render(<App />)
}
