import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Header } from './Header'
import type { WordCardProps } from './WordCard'
import { WordCard } from './WordCard'
import type { ExportModalTitle } from './export-modal'
import { ExportModal } from './export-modal'

import './_style.scss'
import { useTranslation } from 'react-i18next'
import type { Word } from '@/types/word'
import { deleteWords, getWords } from '@/core/index-db'
import type { DBArea } from '@/core/index-db/types'

const ITEMS_PER_PAGE = 200

type CardInfo = Pick<
  WordCardProps,
  'dataSource' | 'pagination' | 'rowSelection' | 'loading'
>

interface FetchWordsConfig {
  itemsPerPage?: number
  pageNum?: number
  filters: { [field: string]: (string | number)[] }
  sortField?: string | (string)[]
  sortOrder?: 'ascend' | 'descend'
  searchText: string
}

const initialFetchWordsConfig: Readonly<FetchWordsConfig> = {
  searchText: '',
  itemsPerPage: ITEMS_PER_PAGE,
  pageNum: 1,
  filters: {},
}

export interface WordPageProps {
  area: DBArea
}

export const WordPage: FC<WordPageProps> = props => {
  const { t } = useTranslation('wordPage')
  const [searchText, setSearchText] = useState('')
  const [selectedRows, setSelectedRows] = useState<Word[]>([])
  const [cardInfo, setCardInfo] = useState<CardInfo>(() => ({
    dataSource: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: 1,
      pageSize: ITEMS_PER_PAGE,
      defaultPageSize: ITEMS_PER_PAGE,
      total: 0,
    },
    rowSelection: {
      selectedRowKeys: [],
      onChange: (selectedRowKeys: React.Key[], selectedRows: Word[]) => {
        setCardInfo(lastInfo => ({
          ...lastInfo,
          rowSelection: {
            ...lastInfo.rowSelection,
            selectedRowKeys,
          } as NonNullable<typeof lastInfo.rowSelection>,
        }))
        setSelectedRows(selectedRows)
      },
    },
    loading: false,
  }))

  const [exportModalTitle, setExportModalTitle] = useState<ExportModalTitle>('')
  const [exportModalWords, setExportModalWords] = useState<Word[]>([])

  const [fetchWordsConfig] = useState(
    initialFetchWordsConfig
  )
  const fetchWords = async (config: Partial<FetchWordsConfig>) => {
    const res = await getWords({
      area: props.area,
      ...config,
    }).catch(e => {
      console.error(e)
      return { total: 0, words: [] }
    })
    setExportModalWords(res.words)
  }

  useEffect(() => {
    const handler = (): void => {
      fetchWords({})
    }
    handler()
  }, [])

  return (
    <div className="wordPage-Container">
      <title>{t(`title.${props.area}`)}</title>
      <Header
        area={props.area}
        searchText={searchText}
        totalCount={(cardInfo.pagination && cardInfo.pagination.total) || 0}
        selectedCount={selectedRows.length}
        onSearchTextChanged={text => {
          setSearchText(text)
          fetchWords({ searchText: text })
        }}
        onExport={async (key) => {
          if (key === 'all') {
            const { total, words } = await getWords({
              area: props.area,
              ...fetchWordsConfig,
              itemsPerPage: undefined,
              pageNum: undefined,
            })
            if (import.meta.env.VITE_DEBUG) {
              console.assert(words.length === total, 'get all words')
            }
            setExportModalTitle(key)
            setExportModalWords(words)
          } else if (key === 'selected') {
            setExportModalTitle(key)
            setExportModalWords(selectedRows)
          } else if (key === 'page') {
            setExportModalTitle(key)
            const dataSource = cardInfo.dataSource || []
            const copyData = dataSource.map((item: Word) => ({ ...item }))
            setExportModalWords(copyData)
          } else {
            setExportModalTitle('')
          }
        }}
        // onDelete={key => {
        //   let keys: number[] | undefined = []
        //   if (key === 'selected') {
        //     keys = cardInfo.rowSelection?.selectedRowKeys?.map(date =>
        //       Number(date)
        //     )
        //   } else if (key === 'page') {
        //     keys = cardInfo.dataSource?.map(({ date }) => date)
        //   } else {
        //     keys = undefined
        //   }

        //   deleteWords({
        //     area: props.area,
        //     keyList: keys,
        //   }).then(() => fetchWords({})).catch(err => {
        //     console.warn(err)
        //   })
        // }}
      />
      <WordCard
        area={props.area}
        {...cardInfo}
        onChange={(pagination, filters, sorter) => {
          window.scrollTo(0, 0)

          setCardInfo(lastInfo => ({
            ...lastInfo,
            pagination: {
              ...lastInfo.pagination,
              current: pagination.current || 1,
            },
          }))

          // const realSorter = Array.isArray(sorter) ? sorter[0] : sorter

          fetchWords({
            itemsPerPage: pagination?.pageSize || ITEMS_PER_PAGE,
            pageNum: pagination?.current || 1,
            searchText,
          })
        }}
      />
      <ExportModal
        title={exportModalTitle}
        rawWords={exportModalWords}
        onCancel={() => {
          setExportModalTitle('')
        }}
      />
    </div>
  )
}
