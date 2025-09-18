import { connect, MapStateToProps } from 'react-redux'

import { StoreState } from '@/content/redux/modules'
import { WordEditor, WordEditorProps } from './WordEditor'
import { useDictStore } from '@P/saladict-core/src/store'

const onClose = () => {
  window.close()
}

const mapStateToProps: MapStateToProps< StoreState, WordEditorProps, any> = (state) => ({
  darkMode: state.config.darkMode,
  containerWidth: window.innerWidth,
  ctxTrans: state.config.ctxTrans,
  wordEditor: state.wordEditor,
  onClose
})

export const WordEditorStandaloneContainer = () => {
  const globalState = useDictStore()
  return <WordEditor wordEditor={{
    word: undefined,
    translateCtx: false
  }} ctxTrans={undefined} onClose={function (): void {
    throw new Error('Function not implemented.')
  } } containerWidth={0} ></WordEditor>
}


export { WordEditor }
