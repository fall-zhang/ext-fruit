import type { FC, ReactNode } from 'react'


import './MenuBar.scss'
// import type { ProfilesProps } from './Profiles'
// import { ProfilePopover } from './Profiles'
import { HistoryIcon } from 'lucide-react'

export interface MenuBarProps {
  customButton?: ReactNode
  onShowHistory(): void
}

export const MenuBar: FC<MenuBarProps> = (props) => {
  return (
    <header className="menuBar">
      <button className="px-2 hover:bg-black/10 h-full  flex items-center justify-center" onClick={props.onShowHistory} >
        <HistoryIcon
          className="text-white dark:text-black"
          strokeWidth={1}
          size={18}
        />
      </button>
      <div className="grow h-full" data-tauri-drag-region={true}></div>
      {/* 自定义 button 列表 */}
      {props.customButton}
      {/* <FavBtn
        isFav={store.isInNotebook}
        onClick={addToNoteBook}
        onMouseDown={e => {
          if (e.button === 2) {}
        }}
      /> */}
      {/*
        <NotebookBtn
          t={t}
          onClick={() => {
            // 查看 Notebook 生词本
          }}/>
          <SidebarBtn
            onMouseDown={e => {
              e.preventDefault()
              store.onSwitchSidebar(e.button === 0 ? 'left' : 'right')
            }}
          />
          <CloseBtn t={t} onClick={store.onClose} />
         */}
    </header>
  )
}
