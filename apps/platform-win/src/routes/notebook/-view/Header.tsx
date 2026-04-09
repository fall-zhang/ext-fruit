import type { FC } from 'react'

import type { DBArea } from '@/core/index-db/types'
import { useConfirmContext } from '@/context/confirm-context'
import { useTranslation } from 'react-i18next'
import { Button } from '@P/ui/components/button'
import { Input } from '@P/ui/components/input'
export interface WordPageProps {
  area: DBArea
  searchText: string
  totalCount: number
  selectedCount: number
  onSearchTextChanged: (text: string) => void
  onExport(type: 'all' | 'selected' | 'page'): void
  // onDelete: (key: string) => void
}

export const Header: FC<WordPageProps> = props => {
  const { t } = useTranslation(['wordPage'])
  // const confirm = useConfirmContext()
  // const deleteConfirm = (key: 'selected' | 'page' | 'all') => {
  //   if (key) {
  //     confirm.confirm({
  //       title: t('delete'),
  //       description: t(`delete.${key}`) + t('delete.confirm'),
  //       onConfirm: () => props.onDelete(`${key}`),
  //     })
  //   }
  // }
  return (
    <div className="wordpage-Header flex z-100 w-full left-0 top-0 fixed justify-between">
      <div className="wordpage-Title">
        <h2 className="wordpage-Title_head">
          {t(`title.${props.area}`)}{' '}
          <small className="wordpage-Title_small">({t('localOnly')})</small>
        </h2>
        <div style={{ whiteSpace: 'nowrap' }}>
          {props.totalCount > 0 && (
            <span className="wordpage-Wordcount">
              {t('wordCount.total', { count: props.totalCount })}
            </span>
          )}
          {props.selectedCount > 0 && (
            <span className="wordpage-Wordcount">
              {t('wordCount.selected', { count: props.selectedCount })}
            </span>
          )}
        </div>
      </div>
      <Input
        className='w-80'
        placeholder=""
        onChange={e => props.onSearchTextChanged(e.currentTarget.value)}
        value={props.searchText}
      />
      <Button>{t('export.all')}</Button>
    </div>
  )
}
