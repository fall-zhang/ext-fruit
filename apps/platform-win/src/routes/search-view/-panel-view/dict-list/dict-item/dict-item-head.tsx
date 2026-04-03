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
      Math.random() * 1500
    )
    return () => {
      clearTimeout(ticket)
    }
  }, [props.isSearching])

  function addToNotebook () {
  }
  return (
    <header
      className={clsx('dictItemHead flex items-center dark:bg-neutral-800 dark:text-neutral-100 h-7', {
        isSearching: props.isSearching,
      })}
    >
      <button
        className="cursor-pointer size-5 mr-2"
        onMouseOut={e => e.currentTarget.blur()}
        onClick={props.toggleFold}
      >
        <ChevronRightIcon className={cn('text-neutral-900 dark:text-neutral-300 ', !props.isFold && 'rotate-90')} />
        {/* <svg
          className={cn('dictItemHead-FoldArrow')}
          width="18"
          height="18"
          viewBox="0 0 59.414 59.414"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="dictItemHead-FoldArrowPath"
            d="M43.854 59.414L14.146 29.707 43.854 0l1.414 1.414-28.293 28.293L45.268 58"
          />
        </svg> */}
      </button>
      <img className="dictItemHead-Logo" src={`/src/core/api-server/trans-api/${props.dictID}/favicon.png`} alt="dict logo" />
      <h4 className="dictItemHead-Title">
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
      <Tooltip >
        <TooltipTrigger>
          <BookmarkIcon onClick={addToNotebook} />
        </TooltipTrigger>
        <TooltipContent >
          <p>收藏</p>
        </TooltipContent>
      </Tooltip>
      {showLoader && (
        <div className="dictItemHead-Loader">
          <div />
        </div>
      )}
      <div className="dictItemHead-EmptyArea" onClick={props.toggleFold} />
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
