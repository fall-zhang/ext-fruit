import React, { FC, ReactNode } from 'react'
<<<<<<< HEAD:packages/saladict-core/src/views/word-editor/WordEditor/WordEditorPanel.tsx
// import { isInternalPage } from '@/_helpers/saladict'
import { isInternalPage } from '@P/saladict-core/src/core/saladict-state'
=======
import { isInternalPage } from '@/_helpers/saladict'
>>>>>>> c908eaa999dbc831b8e70709cf53b61208abd9f2:packages/saladict-core/src/content/components/WordEditor/WordEditorPanel.tsx

export type WordEditorPanelBtns = Array<{
  type?: 'normal' | 'primary'
  title: React.ReactNode
  onClick: () => void
}>

export interface WordEditorPanelProps {
  children:ReactNode
  containerWidth: number
  title: React.ReactNode
  btns?: WordEditorPanelBtns
  children:ReactNode
  onClose: () => void
}

export const WordEditorPanel: FC<WordEditorPanelProps> = props => {
  return (
    <div
      className="wordEditorPanel-Background"
      style={{
        zIndex: isInternalPage() ? 998 : 2147483646 // for popups on options page
      }}
    >
      <div
        className="wordEditorPanel-Container"
        style={{ width: props.containerWidth }}
      >
        <div className="wordEditorPanel">
          <header className="wordEditorPanel-Header">
            <h1 className="wordEditorPanel-Title">{props.title}</h1>
            <button
              type="button"
              className="wordEditorPanel-BtnClose"
              onClick={props.onClose}
            >
              ×
            </button>
          </header>
          <div className="wordEditorPanel-Main fancy-scrollbar">
            {props.children}
          </div>
          {props.btns && props.btns.length > 0 && (
            <footer className="wordEditorPanel-Footer">
              {props.btns.map((btn, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    btn.type
                      ? `wordEditorPanel-Btn_${btn.type}`
                      : 'wordEditorPanel-Btn'
                  }
                  onClick={btn.onClick}
                >
                  {btn.title}
                </button>
              ))}
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

export default WordEditorPanel
