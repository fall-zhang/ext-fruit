import { createRoot } from 'react-dom/client'

// import { I18nContextProvider } from '@/_helpers/i18n'

import './_style.scss'
import { SaladBowl } from './SaladBowl/SaladBowl'
import DictPanelPortal from './DictPanel/DictPanel.portal'
import { WordEditor } from './word-editor/WordEditor/WordEditor'

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
