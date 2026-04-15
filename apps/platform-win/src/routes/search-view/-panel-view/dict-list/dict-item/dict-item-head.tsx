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
      className={clsx('dictItemHead flex items-center dark:bg-neutral-900 dark:text-neutral-200 h-7', {
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
      <img className="dictItemHead-Logo" src={dictImage[props.dictID]} alt="dict logo" />
      <h4 className="dictItemHead-Title ml-2">
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
          <BookmarkIcon onClick={addToNotebook} />
        </TooltipTrigger>
        <TooltipContent >
          <p>收藏</p>
        </TooltipContent>
      </Tooltip>
      {/* <div className="dictItemHead-EmptyArea" onClick={props.toggleFold} /> */}
    </header>
  )
}

function MenusBtn (props: React.ComponentProps<'button'>) {
  return (
    <button className="dictItemHead-Menus_Btn" {...props}>
      <svg width="16" height="16" viewBox="0 0 512 512">
        <path d="M301.256 394.29A45.256 45.256 0 01256 439.546a45.256 45.256 0 01-45.256-45.256A45.256 45.256 0 01256 349.034a45.256 45.256 0 0145.256 45.256zM301.256 257.48A45.256 45.256 0 01256 302.736a45.256 45.256 0 01-45.256-45.256A45.256 45.256 0 01256 212.224a45.256 45.256 0 0145.256 45.256zM301.256 117.71A45.256 45.256 0 01256 162.964a45.256 45.256 0 01-45.256-45.256A45.256 45.256 0 01256 72.453a45.256 45.256 0 0145.256 45.256z" />
      </svg>
    </button>
  )
}
