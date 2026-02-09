import { useEffect, useState, type FC } from 'react'
import type React from 'react'
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
import type { ProfilesProps } from './Profiles'
import { Profiles } from './Profiles'
import type { Word } from '@P/saladict-core/src/types/word'
import { useTranslation } from 'react-i18next'

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

  onSelectProfile: (id: string) => void
  profiles: ProfilesProps['profiles']
  activeProfileId: ProfilesProps['activeProfileId']

  isPinned: boolean
  togglePin: () => any

  isQSFocus: boolean
  toggleQSFocus: () => any

  onClose: () => any
  onSwitchSidebar: (side: 'left' | 'right') => any

  onHeightChanged: (height: number) => void

  onDragAreaMouseDown: (e: React.MouseEvent<HTMLDivElement>) => any
  onDragAreaTouchStart: (e: React.TouchEvent<HTMLDivElement>) => any
}

export const MenuBar: FC<MenuBarProps> = ({
  onHeightChanged,
  ...props
}) => {
  const { t } = useTranslation(['content', 'common'])
  const [profileHeight, setProfileHeight] = useState<number>()
  const [searchBoxHeight, setSearchBoxHeight] = useState<number>()

  useEffect(() => {
    const max = Math.max(profileHeight || 0, searchBoxHeight || 0)
    onHeightChanged(max > 0 ? max + 72 : 0)
  }, [profileHeight, onHeightChanged, searchBoxHeight])
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
      <SearchBox
        key="searchbox"
        t={t}
        text={props.text}
        shouldFocus={props.shouldFocus}
        enableSuggest={props.enableSuggest}
        onInput={props.updateText}
        onSearch={props.searchText}
        onHeightChanged={(height) => setSearchBoxHeight(height)}
      />
      {isStandalonePage() || (
        <div
          className="menuBar-DragArea"
          onMouseDown={props.onDragAreaMouseDown}
          onTouchStart={props.onDragAreaTouchStart}
        />
      )}
      <Profiles
        t={t}
        profiles={props.profiles}
        activeProfileId={props.activeProfileId}
        onSelectProfile={props.onSelectProfile}
        onHeightChanged={(height) => {
          setProfileHeight(height)
        }}
      />
      <FavBtn
        t={t}
        isFav={props.isInNotebook}
        onClick={props.addToNoteBook}
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
      {props.isTrackHistory
        ? (
          <HistoryBtn
            t={t}
            onClick={() => {
              // message.send({
              //   type: 'OPEN_URL',
              //   payload: { url: 'history.html', self: true },
              // })
            }}
          />
        )
        : (
          <NotebookBtn
            t={t}
            onClick={() => {
              // message.send({
              //   type: 'OPEN_URL',
              //   payload: { url: 'notebook.html', self: true },
              // })
            }
            }
          />
        )}

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
      {
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
              props.onSwitchSidebar(e.button === 0 ? 'left' : 'right')
            }}
          />
        </>)
      }
      {renderType === 'Btns' && (
        <>
          <PinBtn
            t={t}
            isPinned={props.isPinned}
            onClick={props.togglePin}
            disabled={isOptionsPage() || isPopupPage()}
          />
          <CloseBtn t={t} onClick={props.onClose} />
        </>
      )}
    </header>
  )
}
