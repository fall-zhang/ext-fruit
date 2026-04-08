import type { CSSProperties, FC, ReactNode } from 'react'
import './_style.scss'
import { useSearchContext } from '@/context/search-context'
import { useCallback, useRef, useState, useEffect } from 'react'
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
import { NotebookPanel } from './notebook-panel/notebook-panel'
import { getWords } from '@/core/index-db/read'
import { deleteWords } from '@/core/index-db/write'

type SaladPanelProps = {
  menuBarProps?: Record<string, any>
  customButton?: ReactNode
}
export const SaladContent: FC<SaladPanelProps> = (props) => {
  const config = useConfContext().config
  const withAnimation = config.animation
  // const darkMode = config.darkMode
  // const panelCSS = config.panelCSS
  const fontSize = config.fontSize
  const enableSuggest = config.searchSuggests
  const [historyShow, setHistoryShow] = useState(false)
  const [notebookShow, setNotebookShow] = useState(false)
  const [notebookWords, setNotebookWords] = useState<Word[]>([])

  const searchStart = useSearchContext((store) => store.searchStart)
  const renderedDicts = useSearchContext((store) => store.renderedDicts)
  const store = useSearchContext((store) => store)

  // 加载生词本数据
  useEffect(() => {
    if (notebookShow) {
      getWords({
        area: 'notebook',
        sortField: 'date',
        sortOrder: 'descend',
      }).then(({ words }) => {
        setNotebookWords(words)
      }).catch(err => {
        console.error('加载生词本数据失败:', err)
      })
    }
  }, [notebookShow])

  // 删除生词
  const handleDeleteWord = useCallback(async (wordKey: number) => {
    try {
      await deleteWords({
        area: 'notebook',
        keyList: [wordKey],
      })
      setNotebookWords(prev => prev.filter(w => w.date !== wordKey))
    } catch (error) {
      console.error('删除生词失败:', error)
    }
  }, [])

  // const updateText = useCallback(debounce((text: string) => {
  //   searchStart({
  //     word: newWord({
  //       text,
  //     }),
  //   })
  // }, 600), [])
  const searchText = (text: string) => {
    searchStart({
      word: newWord({
        text,
      }),
    })
  }

  const rootElRef = useRef<HTMLDivElement | null>(null)

  // an extra layer as float box offest parent
  return (<div
    className={clsx('dictPanel-FloatBox-Container bg-neutral-100 dark:bg-neutral-900 ', {
      isAnimate: withAnimation,
    })}
  >
    <div ref={rootElRef} className="saladict-theme overflow-hidden h-screen">
      <div className="dictPanel-Head sticky top-0">
        <MenuBar
          onShowHistory={() => setHistoryShow(true)}
          onShowNotebook={() => setNotebookShow(true)}
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
            enableSuggest={enableSuggest}
            onSend={searchText} />
        </div>
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
    <NotebookPanel
      open={notebookShow}
      words={notebookWords}
      onClose={() => {
        setNotebookShow(false)
      }}
      onSelect={(item: Word) => {
        setNotebookShow(false)
      }}
      onDelete={handleDeleteWord} />
  </div>)
}
