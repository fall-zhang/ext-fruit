import { createRoot } from 'react-dom/client'

// import { I18nContextProvider } from '@/_helpers/i18n'

import './_style.scss'
import { SaladBowl } from '@P/saladict-core/src/views/SaladBowl/SaladBowl'
import { WordEditor } from '@P/saladict-core/src/views/word-editor/WordEditor/WordEditor'
import DictPanelPortal from '@P/saladict-core/src/views/DictPanel/DictPanel.portal'

export async function ContentPage () {
  const App = () => (<>
    <SaladBowl />
    <DictPanelPortal />
    <WordEditor />
  </>
  )
  const root = createRoot(document.createElement('div'))
  root.render(<App />)
}
