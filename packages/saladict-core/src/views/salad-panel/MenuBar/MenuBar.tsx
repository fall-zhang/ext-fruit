import { useEffect, useState, type FC } from 'react'
import {
  isStandalonePage,
  isOptionsPage,
  isPopupPage,
  isQuickSearchPage
} from '@P/saladict-core/src/core/saladict-state'
import {
  HistoryBackBtn,
  HistoryNextBtn,
  FavBtn,
  HistoryBtn,
  NotebookBtn,
  PinBtn,
  CloseBtn,
  SidebarBtn,
  FocusBtn
} from './MenubarBtns'
import type { SearchBoxProps } from './SearchBox'
import { SearchBox } from './SearchBox'
import './MenuBar.scss'
// import type { ProfilesProps } from './Profiles'
// import { ProfilePopover } from './Profiles'
import type { Word } from '@P/saladict-core/src/types/word'
import { useTranslation } from 'react-i18next'
import { useDictStore } from '@P/saladict-core/src/store'
import { debounce } from 'es-toolkit'
import { useShallow } from 'zustand/shallow'
import { useConfContext } from '@P/saladict-core/src/context/conf-context'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'

export interface MenuBarProps {
  text: string
  updateText: SearchBoxProps['onInput']
  searchText: (text: string) => any

  /** is in Notebook */
  isInNotebook: boolean
  addToNoteBook: () => any

  shouldFocus: boolean
  enableSuggest: boolean

  isTrackHistory: boolean
  histories: Word[]
  historyIndex: number
  switchHistory: (direction: 'prev' | 'next') => void
  // 选中对应的预设模式
  // onSelectProfile: (id: string) => void
  // activeProfileId: ProfilesProps['activeProfileId']
  // profiles: ProfilesProps['profiles']

  isPinned: boolean
  togglePin: () => any

  isQSFocus: boolean
  toggleQSFocus: () => any

  onClose: () => any
  onSwitchSidebar: (side: 'left' | 'right') => any

  onHeightChanged: (height: number) => void
}

export const MenuBar: FC = () => {
  const configContext = useConfContext()
  const config = {
    enableSuggest: configContext.config.searchSuggests,
    isTrackHistory: configContext.config.searchHistory,
  }
  // const props = {
  //   historyIndex: 0,
  //   histories: [],
  //   text: 'awesome',
  // }
  const props = useDictStore(useShallow((store) => {
    return {
      text: store.text,
      isInNotebook: store.isFav,
      shouldFocus: false, // is quick search panel or popup page
      //   shouldFocus: !store.isExpandMtaBox && // multiline search box must be folded
      // (((store.isQSPanel || isQuickSearchPage()) && store.config.qsFocus) || isPopupPage()), // is quick search panel or popup page
      histories: store.searchHistory,
      historyIndex: store.historyIndex,
      activeProfileId: store.activeProfile.id,
      isPinned: store.isPinned,
      isQSFocus: store.isQSFocus,
      switchHistory: store.SWITCH_HISTORY,
      searchStart: store.SEARCH_START,
      searchText: store.SEARCH_START,
    }
  }))

  const updateText = debounce((text: string) => {
    props.searchStart({
      word: newWord({
        text,
        title: 'Saladict',
        favicon: 'https://saladict.crimx.com/favicon.ico',
      }),
    })
  }, 200)
  function searchText (text: string) {
    console.log('⚡️ line:89 ~ text: ', text)
    props.searchStart({
      word: newWord({
        text,
        title: 'Saladict',
        favicon: 'https://saladict.crimx.com/favicon.ico',
      }),
    })
  }
  function addToNoteBook () {
    // 将当前单词添加到 notebook
  }
  // function switchHistory () {
  //   // store.SWITCH_HISTORY
  // }
  function togglePin () {
    // store({ type: 'TOGGLE_PIN' })
  }
  function toggleQSFocus () {
    // dispatch({ type: 'TOGGLE_QS_FOCUS' })
  }
  function onClose () {
    // dispatch({ type: 'CLOSE_PANEL' })
  }
  function onSwitchSidebar (side: 'left' | 'right') {
    // message.send({ type: 'QS_SWITCH_SIDEBAR', payload: side })
  }

  // const onHeightChanged = (height: number) => {
  //   dispatch({
  //     type: 'UPDATE_PANEL_HEIGHT',
  //     payload: {
  //       area: 'menubar',
  //       height: 30,
  //       floatHeight: height,
  //     },
  //   })
  // }
  const { t } = useTranslation(['content', 'common'])
  // const [profileHeight, setProfileHeight] = useState<number>()
  // const [searchBoxHeight, setSearchBoxHeight] = useState<number>()

  // useEffect(() => {
  //   const max = Math.max(profileHeight || 0, searchBoxHeight || 0)
  //   onHeightChanged(max > 0 ? max + 72 : 0)
  // }, [profileHeight, onHeightChanged, searchBoxHeight])
  let renderType = 'QuickSearchPage'
  if (isQuickSearchPage()) {
    renderType = 'QuickSearchPage'
  } else if (isPopupPage()) {
    renderType = 'nothing'
  } else {
    renderType = 'Btns'
  }
  return (
    <header className="menuBar">
      <HistoryBackBtn
        t={t}
        disabled={props.historyIndex <= 0}
        onClick={() => props.switchHistory('prev')}
      />
      <HistoryNextBtn
        t={t}
        disabled={props.historyIndex >= props.histories.length - 1}
        onClick={() => props.switchHistory('next')}
      />

      {/* <ProfilePopover
        profiles={props.profiles}
        activeProfileId={props.activeProfileId}
        onSelectProfile={props.onSelectProfile}
        onHeightChanged={(height) => {
          setProfileHeight(height)
        }}
      /> */}
      <FavBtn
        t={t}
        isFav={props.isInNotebook}
        onClick={addToNoteBook}
        onMouseDown={e => {
          if (e.button === 2) {
            e.preventDefault()
            e.stopPropagation()
            e.currentTarget.blur()
            // message.send({
            //   type: 'OPEN_URL',
            //   payload: {
            //     url: 'notebook.html',
            //     self: true,
            //   },
            // })
          }
        }}
      />
      {/* {config.isTrackHistory
        ? (<HistoryBtn
          t={t}
          onClick={() => {
            // 查看搜索历史记录
          }}
        />)
        : (<NotebookBtn
          t={t}
          onClick={() => {
            // 查看 Notebook 生词本
          }}
        />)} */}
      {/* 自定义 button 列表 */}
      {/* {customButton} */}
      {/* {isQuickSearchPage()
        ? (
          <>
            <FocusBtn
              t={t}
              isFocus={props.isQSFocus}
              onClick={props.toggleQSFocus}
              disabled={isOptionsPage() || isPopupPage()}
            />
            <SidebarBtn
              t={t}
              onMouseDown={e => {
                e.preventDefault()
                props.onSwitchSidebar(e.button === 0 ? 'left' : 'right')
              }}
            />
          </>
        )
        : isPopupPage()
          ? null
          : (
            <>
              <PinBtn
                t={t}
                isPinned={props.isPinned}
                onClick={props.togglePin}
                disabled={isOptionsPage() || isPopupPage()}
              />
              <CloseBtn t={t} onClick={props.onClose} />
            </>
          )} */}
      {/* {
        renderType === 'QuickSearchPage' && (<>
          <FocusBtn
            t={t}
            isFocus={props.isQSFocus}
            onClick={props.toggleQSFocus}
            disabled={isOptionsPage() || isPopupPage()}
          />
          <SidebarBtn
            t={t}
            onMouseDown={e => {
              e.preventDefault()
              onSwitchSidebar(e.button === 0 ? 'left' : 'right')
            }}
          />
        </>)
      } */}
      {/* {renderType === 'Btns' && (
        <>
          <PinBtn
            t={t}
            isPinned={props.isPinned}
            onClick={props.togglePin}
            disabled={isOptionsPage() || isPopupPage()}
          />
          <CloseBtn t={t} onClick={props.onClose} />
        </>
      )} */}
    </header>
  )
}
