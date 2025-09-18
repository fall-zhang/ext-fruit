import { I18nContextProvider } from '../../locales/i18n'
import './word-editor.scss'
import { WordEditorStandaloneContainer } from './WordEditor/WordEditorStandalone.container'


export const WordEditor = () => {
  document.title = 'Saladict Word Editor'
  // const dictStore = useDictStore()

  return <I18nContextProvider>
    <WordEditorStandaloneContainer />
  </I18nContextProvider>
}
