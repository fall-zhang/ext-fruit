import { useEffect, useState, type FC, type ReactNode } from 'react'

import {
  FocusBtn,
  HistoryBackBtn,
  HistoryNextBtn
} from './MenubarBtns'
import './MenuBar.scss'
// import type { ProfilesProps } from './Profiles'
// import { ProfilePopover } from './Profiles'
import { useTranslation } from 'react-i18next'
import { useDictStore } from '@/store'
import { useShallow } from 'zustand/shallow'
import { useConfContext } from '@/context/conf-context'
import { useSearchContext } from '@/context/search-context'

export interface MenuBarProps {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode

  // /** is in Notebook */
  // isInNotebook: boolean
  // addToNoteBook: () => any

  // enableSuggest: boolean
  // isTrackHistory: boolean
  // histories: Word[]
  // historyIndex: number
  // switchHistory: (direction: 'prev' | 'next') => void
  // // 选中对应的预设模式
  // // onSelectProfile: (id: string) => void
  // // activeProfileId: ProfilesProps['activeProfileId']
  // // profiles: ProfilesProps['profiles']

  // togglePin: () => any

  // toggleQSFocus: () => any

  // onClose: () => any
  // onSwitchSidebar: (side: 'left' | 'right') => any

  // onHeightChanged: (height: number) => void
}

export const MenuBar: FC<MenuBarProps> = (props) => {
  const searchContext = useSearchContext(store => store)
  const switchHistory = searchContext.switchHistory

  const store = useDictStore(useShallow((store) => {
    return {
      isInNotebook: store.isFav,
      shouldFocus: false, // is quick search panel or popup page
      historyIndex: store.historyIndex,
    }
  }))

  return (
    <header className="menuBar">
      <HistoryBackBtn
        disabled={store.historyIndex <= 0}
        onClick={() => switchHistory('prev')}
      />
      <HistoryNextBtn
        disabled={store.historyIndex >= searchContext.searchHistory.length - 1}
        onClick={() => switchHistory('next')}
      />
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
