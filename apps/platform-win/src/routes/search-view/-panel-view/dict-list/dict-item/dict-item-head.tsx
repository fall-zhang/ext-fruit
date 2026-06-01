import type { FC } from 'react'
import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import './dict-item-head.scss'
import type { DictID } from '@/core/api-server/config'
import { BookmarkIcon, ChevronRight, ChevronRightIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@P/ui/components/tooltip'
import { cn } from '@P/ui/utils'
import { dictImage } from '../dictImg'

// const error = import.meta.glob('@/core/api-server/trans-api/*/favicon.png')
export interface DictItemHeadProps {
  dictID: DictID
  isFold: boolean
  isSearching: boolean
  toggleFold: () => void
  openDictSrcPage: (id: DictID, ctrlKey: boolean) => void
  onCatalogSelect: (item: { key: string; value: string }) => void
}

export const DictItemHead: FC<DictItemHeadProps> = props => {
  const { t } = useTranslation(['dicts', 'content', 'langcode'])

  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    // small time offset to add a little organic feeling
    const ticket = setTimeout(
      () => setShowLoader(props.isSearching),
      Math.random() * 800
    )
    return () => {
      clearTimeout(ticket)
    }
  }, [props.isSearching])

  function addToNotebook () {
  }
  return (
    <header
      className={clsx('dictItemHead border-t box-border sticky dark:border-t-neutral-500 border-t-neutral-400 border-dashed flex items-center dark:bg-neutral-900 dark:text-neutral-200 h-7', {
        isSearching: props.isSearching,
      })}
    >
      <button
        className="cursor-pointer size-6 mr-1"
        onMouseOut={e => e.currentTarget.blur()}
        onClick={props.toggleFold}
      >
        <ChevronRightIcon className={cn('text-neutral-900 dark:text-neutral-300 ', !props.isFold && 'rotate-90')} />
      </button>
      <img className="size-5 select-none" src={dictImage[props.dictID]} alt="dict logo" />
      <h4 className="dictItemHead-Title ml-2 text-xs">
        <a
          href="#"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation()
            e.preventDefault()
            props.openDictSrcPage(props.dictID, e.ctrlKey)
          }}
        >
          {t(`${props.dictID}.name`)}
        </a>
      </h4>
      {showLoader && (
        <div className="dictItemHead-Loader">
          <div />
        </div>
      )}
      <div className="grow"></div>
      <Tooltip >
        <TooltipTrigger>
          <BookmarkIcon onClick={addToNotebook} className='text-neutral-900 dark:text-neutral-300 ' />
        </TooltipTrigger>
        <TooltipContent >
          <p>收藏</p>
        </TooltipContent>
      </Tooltip>
      {/* <div className="dictItemHead-EmptyArea" onClick={props.toggleFold} /> */}
    </header>
  )
}
