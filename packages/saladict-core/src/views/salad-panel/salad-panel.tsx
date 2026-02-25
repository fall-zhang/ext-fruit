import type { CSSProperties, FC } from 'react'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { SALADICT_PANEL } from '../../core/saladict-state'
import { MenuBar } from './MenuBar/MenuBar'
import { useConfContext } from '../../context/conf-context'
import { DictList } from './DictList/DictList'
import { I18nextProvider } from 'react-i18next'
import './_style.scss'
import i18n from '../../locales/i18n'
import { useDictStore } from '../../store'
import { debounce } from 'es-toolkit'
import { newWord } from '../../dict-utils/new-word'
import { SearchBox } from './search-input/search-input'
import { useShallow } from 'zustand/shallow'

export const SaladPanel: FC = () => {
  const config = useConfContext().config
  const withAnimation = config.animation
  const darkMode = config.darkMode
  const panelCSS = config.panelCSS
  const fontSize = config.fontSize
  const enableSuggest = config.searchSuggests
  const [inputText, setInputText] = useState('')
  const [showMtaBox, setShowMtaBox] = useState(false)
  // const props = useDictStore(useShallow(store => {
  //   return {
  //     isShowMtaBox: store.isShowMtaBox,
  //     waveformBox: store.activeProfile.waveform ? waveformBox : null,
  //   }
  // }))
  const props = useDictStore(useShallow((store) => {
    return {
      // text: store.text,
      // isInNotebook: store.isFav,
      // shouldFocus: false, // is quick search panel or popup page
      // //   shouldFocus: !store.isExpandMtaBox && // multiline search box must be folded
      // // (((store.isQSPanel || isQuickSearchPage()) && store.config.qsFocus) || isPopupPage()), // is quick search panel or popup page
      // histories: store.searchHistory,
      // historyIndex: store.historyIndex,
      // activeProfileId: store.activeProfile.id,
      // isPinned: store.isPinned,
      // isQSFocus: store.isQSFocus,
      // switchHistory: store.SWITCH_HISTORY,
      // searchText: store.SEARCH_START,
      searchStart: store.SEARCH_START,
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
  const searchText = (text: string) => {
    props.searchStart({
      word: newWord({
        text,
        title: 'Saladict',
        favicon: 'https://saladict.crimx.com/favicon.ico',
      }),
    })
  }

  const rootElRef = useRef<HTMLDivElement | null>(null)

  return (<I18nextProvider i18n={i18n}>
    <div
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
            <MenuBar />
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
              {props.isShowMtaBox && <MtaBox /> }
            </div>
          </HoverBoxContext.Provider> */}
          <DictList />
          {/* {props.waveformBox && <WaveformBox />} */}
        </div>
      </div>
    </div>
  </I18nextProvider>
  )
}
