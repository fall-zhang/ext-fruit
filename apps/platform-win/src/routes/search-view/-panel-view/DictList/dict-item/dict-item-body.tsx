import type { ComponentType, FC } from 'react'
import React, { useMemo, Suspense } from 'react'
import classNames from 'clsx'
import root from 'react-shadow'

import dictContentStyles from './DictItemContent.shadow.scss?raw'
import type { Word } from '@/types/word'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { StaticSpeakerContainer } from '@/components/Speaker'
import type { ViewProps } from '@/components/dict-api-view/type'
import { SALADICT_PANEL } from '@/config/const/saladict'
import type { DictID } from '@/core/api-server/types'

export interface DictItemBodyProps {
  dictID: DictID

  darkMode: boolean
  withAnimation: boolean

  panelCSS: string

  searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  searchResult?: object | null


  dictRootRef: React.RefObject<HTMLDivElement | null>

  searchText: (arg?: {
    id?: DictID
    word?: Word
    payload?: { [index: string]: any }
  }) => any

  onSpeakerPlay: (src: string) => Promise<void>

  onInPanelSelect: (e: React.MouseEvent<HTMLElement>) => void
}

const dictViewMap = import.meta.glob('@/components/dict-api-view/*/View.tsx')

export const DictItemBody: FC<DictItemBodyProps> = props => {
  const Dict = useMemo(() =>
    React.lazy<ComponentType<ViewProps<any>>>(async () => {
      console.log('⚡️ line:43 ~ props.dictID: ', props.dictID)
      const Comp = dictViewMap[`@/components/dict-api-view/${props.dictID}/View.tsx`] as FC<ViewProps<any>>
      if (Comp) {
        return {
          default: Comp,
        }
      }
      return import('@/components/dict-api-view/default/View')
    }

    ),
  [props.dictID]
  )

  const DictStyle = useMemo(() =>
    React.lazy(async () => {
      try {
        const styleModule = await import(
          `@/components/dict-api-view/${props.dictID}/_style.shadow.scss?raw`
        )
        return {
          default: () => (
            <style>{(styleModule.default || styleModule).toString()}</style>
          ),
        }
      } catch (err) {
        console.log('missint dictID: ', props.dictID)
        console.warn('fetch style dict-item err: ', err)
        const styleModule = await import('@/components/dict-api-view/default/MachineTrans.scss?raw')
        return {
          default: () => (
            <style>{(styleModule.default || styleModule).toString()}</style>
          ),
        }
      }
    }),
  [props.dictID]
  )

  return (
    <ErrorBoundary error={DictRenderError}>
      <Suspense fallback={null}>
        {props.searchStatus === 'FINISH' && props.searchResult && (
          <root.div>
            <div
              ref={props.dictRootRef}
              className={classNames({ darkMode: props.darkMode })}
            >
              <style>{dictContentStyles}</style>
              <DictStyle />
              {props.panelCSS ? <style>{props.panelCSS}</style> : null}
              <StaticSpeakerContainer
                className={classNames(
                  `d-${props.dictID}`,
                  'dictRoot',
                  SALADICT_PANEL,
                  { isAnimate: props.withAnimation }
                )}
                onPlayStart={props.onSpeakerPlay}
                onMouseUp={props.onInPanelSelect}
              >
                <Dict
                  result={props.searchResult}
                  searchText={props.searchText}
                />
              </StaticSpeakerContainer>
            </div>
          </root.div>
        )}
      </Suspense>
    </ErrorBoundary>
  )
}

function DictRenderError () {
  return (
    <p>
      Render error. Please{' '}
      <a
        href="https://github.com/fall-zhang/fruit-saladict/issues"
        target="_blank"
        rel="nofollow noopener noreferrer"
        className='text-teal-500'
      >
        report issue
      </a>
      .
    </p>
  )
}
