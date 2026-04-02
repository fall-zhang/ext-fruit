import { useEffect, useState, type FC, type ReactNode } from 'react'


import './MenuBar.scss'
// import type { ProfilesProps } from './Profiles'
// import { ProfilePopover } from './Profiles'
import { HistoryIcon } from 'lucide-react'

export interface MenuBarProps {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode
  onShowHistory(): void
}

export const MenuBar: FC<MenuBarProps> = (props) => {
  return (
    <header className="menuBar">
      <button className="menuBar-Btn flex items-center justify-center" >
        <HistoryIcon
          className="text-white dark:text-black"
          strokeWidth={1}
          size={18}
          onClick={props.onShowHistory}
        />
      </button>
      {/* <HistoryBackBtn
        disabled={store.historyIndex <= 0}
        onClick={() => switchHistory('prev')}
      />
      <HistoryNextBtn
        disabled={store.historyIndex >= searchContext.searchHistory.length - 1}
        onClick={() => switchHistory('next')}
      /> */}
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
        <HistoryBtn
          t={t}
          onClick={() => {
            // 查看搜索历史记录
          }}
        />
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
