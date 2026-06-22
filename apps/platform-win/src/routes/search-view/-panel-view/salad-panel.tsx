import { useSearchContext } from '@/context/search-context/context'
import { TooltipProvider } from '@P/ui/components/tooltip'
import type { FC, ReactNode } from 'react'
import './_style.scss'

import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { MenuBar } from './MenuBar/MenuBar'
import { DictList } from './dict-list/dict-list'
import { newWord } from '@/utils/dict-utils/new-word'
import { SearchArea } from './search-input/search-area'
import type { Word } from '@/types/word'
import { HistoryPanel } from './history-panel/history-panel'
import { NotebookPanel } from './notebook-panel/notebook-panel'
import { getWords } from '@/core/local-db/read'
import { deleteWords } from '@/core/local-db/write'
import { dictImage } from './dict-list/dictImg'
import { useConfContext } from '@/context/conf-context/context'
type SaladPanelProps = {
  customButton?: ReactNode
}

export const SaladPanel: FC<SaladPanelProps> = (props) => {
  const config = useConfContext().config
  const withAnimation = config.animation
  const enableSuggest = config.searchSuggests
  const [historyShow, setHistoryShow] = useState(false)
  const [notebookShow, setNotebookShow] = useState(false)
  const [notebookWords, setNotebookWords] = useState<Word[]>([])

  const searchContext = useSearchContext()
  const searchStart = searchContext.searchStart
  const renderedDicts = searchContext.renderedDicts
  const searchDicts = searchContext.selectedDicts
  const searchHistory = searchContext.searchHistory
  const removeHistoryItem = searchContext.removeHistoryItem

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
  const handleDeleteWord = async (wordKey: string) => {
    try {
      await deleteWords({
        area: 'notebook',
        keyList: [wordKey],
      })
      setNotebookWords(prev => prev.filter(w => w.id !== wordKey))
    } catch (error) {
      console.error('删除生词失败:', error)
    }
  }

  const searchText = (text: string) => {
    searchStart({
      word: newWord({
        text,
      }),
    })
  }

  const rootElRef = useRef<HTMLDivElement | null>(null)
  const handleSelectWord = (item: Word) => {
    searchStart({
      word: item,
    })
  }
  const handleClearHistory = () => {

  }
  return (
    <TooltipProvider>
      <div
        className={clsx('dictPanel-FloatBox-Container bg-neutral-100 dark:bg-neutral-900 ', {
          isAnimate: withAnimation,
        })}
      >
        <div ref={rootElRef} className="saladict-theme overflow-hidden h-screen">
          <MenuBar
            onShowHistory={() => setHistoryShow(true)}
            onShowNotebook={() => setNotebookShow(true)}
            customButton={props.customButton}
          />
          <div className={'dict-panel-root overflow-auto h-full flex flex-col'} >
            <div className="search-zone ">
              <SearchArea
                enableSuggest={enableSuggest}
                onSend={searchText} />
            </div>
            {
              renderedDicts.length === 0
                ? <div className='flex grow flex-col justify-center items-center gap-4'>
                  <div className="flex">
                    {
                      searchDicts.map(item => {
                        return <div className='size-6 p-1 border-neutral-400 dark:border-neutral-700' key={item}>
                          <img src={dictImage[item]} alt="" height='20' width='20' />
                          {/* {dictname} */}
                        </div>
                      })
                    }
                  </div>
                  <span className='text-neutral-500 text-sm'>将自动检测输入语言，并在以上词典中进行查找</span>
                </div>
                : <DictList dicts={renderedDicts} />
            }
            {/* {store.waveformBox && <WaveformBox />} */}
          </div>
        </div>
        <HistoryPanel
          open={historyShow}
          history={searchHistory}
          onRemoveHistoryItem={removeHistoryItem}
          onClose={() => setHistoryShow(false)}
          onSelect={handleSelectWord}
          onClear={handleClearHistory} />
        <NotebookPanel
          open={notebookShow}
          words={notebookWords}
          onClose={() => setNotebookShow(false)}
          onSelect={(item: Word) => {
            setNotebookShow(false)
          }}
          onDelete={handleDeleteWord} />
      </div>
    </TooltipProvider>
  )
}
