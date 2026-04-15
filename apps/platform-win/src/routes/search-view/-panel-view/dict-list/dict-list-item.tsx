import type { FC } from 'react'
import type React from 'react'
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react'
import clsx from 'clsx'
import { newWord } from '@/utils/dict-utils/new-word'
import type { DictItemHeadProps } from './dict-item/dict-item-head'
import { DictItemHead } from './dict-item/dict-item-head'
import type { DictItemBodyProps } from './dict-item/dict-item-body'
import { DictItemBody } from './dict-item/dict-item-body'
import { timer } from '@/utils/promise-more'
import { isTagName } from '@/utils/dom'
import './dict-item.scss'
import type { DictID } from '@/core/api-server/config'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export interface DictItemProps
  extends Omit<DictItemBodyProps, 'dictRootRef' | 'onInPanelSelect'> {
  /** default height when search result is received */
  // preferredHeight: number
  withAnimation: boolean
  /** Inject dict component. Mainly for testing */
  openDictSrcPage: DictItemHeadProps['openDictSrcPage']

  /** User manually folds or unfolds */
  onUserFold: (id: DictID, fold: boolean) => void
}

export const DictItem: FC<DictItemProps> = props => {
  const navigate = useNavigate()
  const [noHeightTransition, setNoHeightTransition] = useState(false)

  const [foldState, setFoldState] = useState<'COLLAPSE' | 'HALF' | 'FULL'>(
    'COLLAPSE'
  )
  /** Rendered height */
  // const [offsetHeight, setOffsetHeight] = useState(10)

  const visibleHeight = useMemo(() => {
    let compareNum = 0
    if (foldState === 'COLLAPSE') {
      compareNum = 0
    } else if (foldState === 'HALF') {
      compareNum = 200
    } else if (foldState === 'FULL') {
      compareNum = -1
    } else {
      compareNum = 200
    }
    return compareNum
  }, [foldState])

  useEffect(() => {
    if (props.searchStatus === 'FINISH') {
      setFoldState('HALF')
    } else {
      setFoldState('COLLAPSE')
    }
  }, [props.searchStatus])

  const dictItemRef = useRef<HTMLDivElement | null>(null)
  // container element in shadow dom
  const dictRootRef = useRef<HTMLDivElement | null>(null)

  const preCatalogSelect = useCallback(
    async (item: { key: string; value: string }) => {
      if (item.key[0] !== '#') {
        // setSelectedCatalog(item)
        return
      }

      // handle anchor jump
      if (!dictRootRef.current) return

      const anchor = dictRootRef.current.querySelector<HTMLElement>(
        `#${item.value}`
      )
      if (!anchor) return

      if (foldState !== 'FULL') {
        setNoHeightTransition(true)
        setFoldState('FULL')
        await timer(0)
        setNoHeightTransition(false)
      }

      if (dictItemRef.current) {
        const rootNode = dictItemRef.current.getRootNode() as HTMLDivElement
        if (rootNode.querySelector) {
          const scrollParent = rootNode.querySelector('.dictPanel-Body')
          if (scrollParent) {
            scrollParent.scrollTo({
              top:
                anchor.getBoundingClientRect().y -
                scrollParent.firstElementChild!.getBoundingClientRect().y -
                30, // plus the sticky title bar
              behavior: props.withAnimation ? 'smooth' : 'auto',
            })
            return
          }
        }
      }

      // Fallback to scrollIntoView
      // The topmost area may scroll beyond dict header due to sticky layout
      anchor.scrollIntoView({
        behavior: props.withAnimation ? 'smooth' : 'auto',
      })
    },
    [foldState, props.withAnimation]
  )
  /** Search the content of an <a> instead of jumping unless it's external */
  function searchLinkText (e: React.MouseEvent<HTMLElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      // ignore if extra key is pressed
      return
    }

    if (!(e.target as HTMLElement).tagName) {
      return
    }

    const $dictItemRoot = e.currentTarget
    for (
      let el: HTMLElement | null = e.target as HTMLElement;
      el && el !== $dictItemRoot;
      el = el.parentElement
    ) {
      if (isTagName(el, 'a') || el.getAttribute('role') === 'link') {
        e.preventDefault()
        e.stopPropagation()

        const $a = el as HTMLAnchorElement
        if (['nofollow', 'noopener', 'noreferrer'].includes($a.rel)) {
          navigate({ to: '' })
        } else {
          props.searchText({
            word: newWord({
              text: $a.textContent || '',
            }),
          })
        }

        return
      }
    }
  }

  function toggleFold () {
    if (props.searchStatus === 'SEARCHING') {
      return
    }

    if (foldState !== 'COLLAPSE') {
      setFoldState('COLLAPSE')
      props.onUserFold(props.dictID, true)
      return
    }

    props.onUserFold(props.dictID, false)

    if (props.searchResult) {
      setFoldState('HALF')
    } else {
      props.searchText({ id: props.dictID })
    }
  }
  function onInPanelSelect () {
    toggleFold
  }
  // console.log('⚡️ line:199 ~ foldState: ', foldState)
  return (
    <section
      ref={dictItemRef}
      className={clsx('dictItem relative', {
        isUnfold: foldState !== 'COLLAPSE',
        noHeightTransition,
      })}
    >
      <DictItemHead
        dictID={props.dictID}
        isFold={foldState === 'COLLAPSE'}
        isSearching={props.searchStatus === 'SEARCHING'}
        toggleFold={toggleFold}
        openDictSrcPage={props.openDictSrcPage}
        onCatalogSelect={preCatalogSelect}
      />
      <div
        className="dictItem-Body relative dark:bg-neutral-800 dark:text-neutral-100"
        key={props.dictID}
        style={{ height: visibleHeight > -1 ? visibleHeight : undefined }}
        onClick={searchLinkText}
      >
        <section className="dictItem-BodyMesure">
          <DictItemBody
            {...props}
            onInPanelSelect={onInPanelSelect}
            dictRootRef={dictRootRef}
          />
        </section>
        {foldState === 'HALF' && props.searchResult && (
          <button
            className="dictItem-FoldMask text-neutral-900 dark:text-neutral-200 flex justify-center"
            onClick={() => setFoldState('FULL')}
          >
            <ChevronDownIcon />
          </button>
        )}
      </div>
      {foldState === 'FULL' && props.searchResult && (
        <button
          className="sticky bottom-0 h-6 w-full text-neutral-900 dark:text-neutral-200 flex justify-center cursor-pointer"
          onClick={() => setFoldState('COLLAPSE')}
        >
          <ChevronUpIcon />
        </button>
      )}
    </section>
  )
}
