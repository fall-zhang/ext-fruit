
import { WordEditor } from './WordEditor'
import { useDictStore } from '@P/saladict-core/src/store'
import { FC } from 'react'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'
import { AppConfig } from '@P/saladict-core/src/app-config'


export const WordEditorStandaloneContainer:FC = () => {
  const config:AppConfig['ctxTrans'] = {
    google: false,
    youdaotrans: false,
    baidu: false,
    tencent: false,
    caiyun: false,
    sogou: false
  }
  // const globalState = useDictStore()
  // const state = {
  //   darkMode: globalState.config.darkMode,
  //   containerWidth: window.innerWidth,
  //   ctxTrans: globalState.config.ctxTrans,
  //   wordEditor: globalState.wordEditor,
  //   onClose(){
  //    window.close()
  //   }
  // }
  return <WordEditor
    wordEditor={{
      word: newWord(),
      translateCtx: false
    }} ctxTrans={config}
    onClose={function (): void {
      throw new Error('Function not implemented.')
    } }
    containerWidth={0}></WordEditor>
}


export { WordEditor }
