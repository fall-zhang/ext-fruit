import type { ComponentType, FC } from 'react'
import React, { useMemo, Suspense } from 'react'
import classNames from 'clsx'
import root from 'react-shadow'

import dictContentStyles from './DictItemContent.shadow.scss?raw'
import type { Word } from '@P/saladict-core/src/types/word'
import { SALADICT_PANEL } from '@P/saladict-core/src/core/saladict-state'
import { ErrorBoundary } from '@P/saladict-core/src/components/ErrorBoundary'
import { StaticSpeakerContainer } from '@P/saladict-core/src/components/Speaker'
import type { DictID } from '@P/api-server/types/all-dict-conf'
import type { ViewProps } from '@P/saladict-core/src/components/dict-api-view/type'

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

export const DictItemBody: FC<DictItemBodyProps> = props => {
  const Dict = useMemo(() =>
    React.lazy<ComponentType<ViewProps<any>>>(() =>
      import(
        `@P/saladict-core/src/components/dict-api-view/${props.dictID}/${props.dictID}.tsx`
      )
    ),
  [props.dictID]
  )

  const DictStyle = useMemo(
    () =>
      React.lazy(async () => {
        const styleModule = await import(
          `@P/saladict-core/src/components/dict-api-view/${props.dictID}/_style.shadow.scss?raw`
        )
        return {
          default: () => (
            <style>{(styleModule.default || styleModule).toString()}</style>
          ),
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
