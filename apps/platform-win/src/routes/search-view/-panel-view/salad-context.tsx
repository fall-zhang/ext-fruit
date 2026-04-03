import type { CSSProperties, FC, ReactNode } from 'react'
import './_style.scss'
import { useSearchContext } from '@/context/search-context'
import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { MenuBar } from './MenuBar/MenuBar'
import { useConfContext } from '@/context/conf-context'
import { DictList } from './dict-list/dict-list'
import { debounce } from 'es-toolkit'
import { newWord } from '@/utils/dict-utils/new-word'
import { SALADICT_PANEL } from '@/config/const/saladict'
import { SearchArea } from './search-input/search-area'
import type { Word } from '@/types/word'
import { HistoryPanel } from './history-panel/history-panel'

type SaladPanelProps = {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode
}
export const SaladContent: FC<SaladPanelProps> = (props) => {
  const config = useConfContext().config
  const withAnimation = config.animation
  const darkMode = config.darkMode
  // const panelCSS = config.panelCSS
  const fontSize = config.fontSize
  const enableSuggest = config.searchSuggests
  const [inputText, setInputText] = useState('')
  const [historyShow, setHistoryShow] = useState(false)

  const searchStart = useSearchContext((store) => store.searchStart)
  const renderedDicts = useSearchContext((store) => store.renderedDicts)
  const store = useSearchContext((store) => store)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateText = useCallback(debounce((text: string) => {
    searchStart({
      word: newWord({
        text,
      }),
    })
  }, 600), [])
  const searchText = () => {
    searchStart({
      word: newWord({
        text: inputText,
      }),
    })
  }

  const rootElRef = useRef<HTMLDivElement | null>(null)

  // an extra layer as float box offest parent
  return (<div
    className={clsx('dictPanel-FloatBox-Container', {
      isAnimate: withAnimation,
      darkMode,
    })}
  >
    <div ref={rootElRef} className="saladict-theme">
      <div className="dictPanel-Head sticky top-0">
        <MenuBar
          onShowHistory={() => setHistoryShow(true)}
          customButton={props.customButton}
        />
      </div>
      <div
        className={`dictPanel-Root ${SALADICT_PANEL} overflow-auto h-full`}
        style={{
          '--panel-font-size': fontSize + 'px',
        } as CSSProperties}
      >
        <div className="search-zone ">
          <SearchArea
            inputValue={inputText}
            enableSuggest={enableSuggest}
            setInputValue={(text) => {
              setInputText(text)
              // updateText(text)
            }}
            onSend={searchText} />
        </div>
        {/* <HoverBoxContext.Provider value={rootElRef}>
            <div className="dictPanel-Body fancy-scrollbar">
              {store.isShowMtaBox && <MtaBox /> }
            </div>
          </HoverBoxContext.Provider> */}
        <DictList
          dicts={renderedDicts} />
        {/* {store.waveformBox && <WaveformBox />} */}
      </div>
    </div>
    <HistoryPanel
      open={historyShow}
      history={store.searchHistory}
      onClose={() => {
        setHistoryShow(false)
      }}
      onSelect={(item: Word) => {
        searchStart({
          word: item,
        })
      }}
      onClear={() => {

      }} />
  </div>)
}
