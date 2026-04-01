import type { CSSProperties, FC, ReactNode } from 'react'
import './_style.scss'
import { useSearchContext } from '@/context/search-context'
import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { MenuBar } from './MenuBar/MenuBar'
import { useConfContext } from '@/context/conf-context'
import { DictList } from './DictList/DictList'
import { debounce } from 'es-toolkit'
import { newWord } from '@/utils/dict-utils/new-word'
import { SALADICT_PANEL } from '@/config/const/saladict'
import { SearchArea } from './search-input/search-area'

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

  const searchStart = useSearchContext((store) => store.searchStart)
  const renderedDicts = useSearchContext((store) => store.renderedDicts)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateText = useCallback(debounce((text: string) => {
    searchStart({
      word: newWord({
        text,
        title: 'Saladict',
        favicon: 'https://saladict.crimx.com/favicon.ico',
      }),
    })
  }, 600), [])
  const searchText = () => {
    searchStart({
      word: newWord({
        text: inputText,
        title: 'Saladict',
        favicon: 'https://saladict.crimx.com/favicon.ico',
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
            } }
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
  </div>)
}
