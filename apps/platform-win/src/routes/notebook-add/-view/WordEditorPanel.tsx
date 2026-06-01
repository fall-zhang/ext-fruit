import type { FC, ReactNode } from 'react'
import type React from 'react'

export type WordEditorPanelBtns = Array<{
  type?: 'normal' | 'primary'
  title: React.ReactNode
  onClick: () => void
}>

export interface WordEditorPanelProps {
  containerWidth: number
  title: React.ReactNode
  btns?: WordEditorPanelBtns
  children: ReactNode
  onClose: () => void
}

export const WordEditorPanel: FC<WordEditorPanelProps> = props => {
  return (
    <div className="wordEditorPanel-Background" >
      <div className="wordEditorPanel">
        <header className="flex border-b border-b-neutral-300 dark:border-b-neutral-800">
          <h2 className="m-0 text-xl p-4">{props.title}</h2>
        </header>
        <div className="wordEditorPanel-Main ">
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
                    ? `wordEditorPanel-Btn ${btn.type}`
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
  )
}

export default WordEditorPanel
