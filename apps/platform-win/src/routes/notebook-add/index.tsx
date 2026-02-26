import { SALADICT_EXTERNAL } from '@P/saladict-core/src/core/saladict-state'
import { createFileRoute } from '@tanstack/react-router'
import './word-editor.scss'
import type { AppConfig } from '@P/saladict-core/src/app-config'
import { Notes } from './-view/Notes'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'

export const Route = createFileRoute('/notebook-add/')({
  component: RouteComponent,
})

function RouteComponent () {
  const config:AppConfig['ctxTrans'] = {
    google: false,
    youdaotrans: false,
    baidu: false,
    tencent: false,
    caiyun: false,
    sogou: false,
  }
  return <div className={`${SALADICT_EXTERNAL} saladict-theme`}
  >
    <Notes wordEditor={{
      word: newWord(),
      translateCtx: false,
    }}
    ctxTrans={config}
    onClose={function (): void {
      throw new Error('Function not implemented.')
    } }
    containerWidth={0} />

  </div>
}
