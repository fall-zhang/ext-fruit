import type { FC } from 'react'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@P/ui/components/card'
import { Button } from '@P/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@P/ui/components/tooltip'
import type { Word } from '@/types/word'
import type { DBArea } from '@/core/index-db/types'
import i18next from 'i18next'
import { Checkbox } from '@P/ui/components/checkbox'

export interface WordCardProps {
  area: DBArea
  dataSource: Word[]
  pagination: {
    current?: number
    pageSize?: number
    total?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    hideOnSinglePage?: boolean
    defaultPageSize?: number
  }
  rowSelection?: {
    selectedRowKeys: React.Key[]
    onChange: (selectedRowKeys: React.Key[], selectedRows: Word[]) => void
  }
  loading?: boolean
  onChange?: (pagination: any, filters: any, sorter: any) => void
}

const ITEMS_PER_PAGE = 200

export const WordCard: FC<WordCardProps> = (props) => {
  const { t } = useTranslation('wordPage')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return props.dataSource.slice(start, end)
  }, [props.dataSource, currentPage, pageSize])

  const totalPages = Math.ceil(props.dataSource.length / pageSize)

  const handleSelect = (word: Word) => {
    if (!props.rowSelection) return

    const isSelected = props.rowSelection.selectedRowKeys.includes(word.date)
    let newSelectedKeys: React.Key[]

    if (isSelected) {
      newSelectedKeys = props.rowSelection.selectedRowKeys.filter(key => key !== word.date)
    } else {
      newSelectedKeys = [...props.rowSelection.selectedRowKeys, word.date]
    }

    const selectedRows = props.dataSource.filter(w =>
      newSelectedKeys.includes(w.date)
    )

    props.rowSelection.onChange(newSelectedKeys, selectedRows)
  }

  const handleSelectAll = () => {
    if (!props.rowSelection) return

    const isAllSelected = paginatedData.every(word =>
      props.rowSelection?.selectedRowKeys.includes(word.date)
    )

    let newSelectedKeys: React.Key[]
    if (isAllSelected) {
      // 取消全选
      newSelectedKeys = props.rowSelection.selectedRowKeys.filter(key =>
        !paginatedData.some(word => word.date === key)
      )
    } else {
      // 全选
      const currentPageKeys = paginatedData.map(word => word.date)
      newSelectedKeys = [...new Set([...props.rowSelection.selectedRowKeys, ...currentPageKeys])]
    }

    const selectedRows = props.dataSource.filter(w =>
      newSelectedKeys.includes(w.date)
    )

    props.rowSelection.onChange(newSelectedKeys, selectedRows)
  }

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(word =>
    props.rowSelection?.selectedRowKeys.includes(word.date)
  )
  let renderType
  if (props.loading) {
    renderType = 'loading'
  } else if (paginatedData.length === 0) {
    renderType = 'empty'
  } else {
    renderType = 'card'
  }
  return (
    <div className="wordCard-container">
      {/* 工具栏 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {props.rowSelection && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {props.rowSelection.selectedRowKeys.length} / {props.dataSource.length}
              </span>
            </div>
          )}
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
            <select
              className="ml-2 rounded-md border bg-background px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={50}>50 / 页</option>
              <option value={100}>100 / 页</option>
            </select>
          </div>
        )}
      </div>

      {renderType === 'loading' && (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      )}
      { renderType === 'empty' && (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">暂无单词</div>
        </div>
      )
      }
      {/* 卡片网格 */}
      { renderType === 'card' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((word) => {
            const isSelected = props.rowSelection?.selectedRowKeys.includes(word.date)
            const date = new Date(word.date)

            return (
              <Card
                key={word.date}
                className={`relative cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelect(word)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{word.text}</CardTitle>
                    {props.rowSelection && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          handleSelect(word)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                  <CardDescription>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          {date.toLocaleDateString(i18next.language)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{date.toLocaleString(i18next.language)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* 翻译 */}
                  {word.trans && (
                    <div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        翻译
                      </div>
                      <div className="text-sm">
                        {word.trans.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 上下文 */}
                  {word.context && (
                    <div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        上下文
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {word.context}
                      </div>
                    </div>
                  )}

                  {/* 笔记 */}
                  {word.note && (
                    <div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        笔记
                      </div>
                      <div className="text-sm italic text-muted-foreground">
                        {word.note.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )
      }
    </div>
  )
}
