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
import { SearchBox } from './search-input/search-input'
import { SALADICT_PANEL } from '@/config/const/saladict'

type SaladPanelProps = {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode
}
export const SaladContent: FC<SaladPanelProps> = (props) => {
  const config = useConfContext().config
  const withAnimation = config.animation
  const darkMode = config.darkMode
  const panelCSS = config.panelCSS
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
  }, 300), [])
  const searchText = (text: string) => {
    searchStart({
      word: newWord({
        text,
        title: 'Saladict',
        favicon: 'https://saladict.crimx.com/favicon.ico',
      }),
    })
  }

  const rootElRef = useRef<HTMLDivElement | null>(null)

  return (<div
    // an extra layer as float box offest parent
    className={clsx('dictPanel-FloatBox-Container', {
      isAnimate: withAnimation,
      darkMode,
    })}
  >
    <div ref={rootElRef} className="saladict-theme">
      {panelCSS ? <style>{panelCSS}</style> : null}
      <div
        className={`dictPanel-Root ${SALADICT_PANEL}`}
        style={{
          '--panel-font-size': fontSize + 'px',
        } as CSSProperties}
      >
        <div className="dictPanel-Head">
          <MenuBar
            menuBarProps={props.menuBarProps}
            customButton={props.customButton}
          />
        </div>
        <div className="search-zone">
          <SearchBox
            text={inputText}
            enableSuggest={enableSuggest}
            onInput={(text) => {
              setInputText(text)
              updateText(text)
            }}
            onSearch={searchText}
          />
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
