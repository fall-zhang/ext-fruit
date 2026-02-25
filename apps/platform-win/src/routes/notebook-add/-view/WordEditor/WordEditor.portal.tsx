import React, { FC, useRef } from 'react'
import { WordEditor } from './WordEditor'
import styleFile from './WordEditor.shadow.scss?raw'
import ShadowPortal from '@P/saladict-core/src/components/ShadowPortal'
import clsx from 'clsx'

export interface WordEditorPortalProps {
  show: boolean
  withAnimation: boolean
  darkMode: boolean
}

export const WordEditorPortal: FC<WordEditorPortalProps> = props => {
  const { show, withAnimation, darkMode, ...restProps } = props
  return (
    <ShadowPortal
      id="saladict-wordeditor-root"
      head={<style>{styleFile}</style>}
      in={show}
      innerRootClassName={clsx({ isAnimate: withAnimation, darkMode })}
      timeout={withAnimation ? 220 : 0}
    >
      {() => <WordEditor {...restProps} />}
    </ShadowPortal>
  )
}

export default WordEditorPortal
