import type { ComponentType, FC } from 'react'
import React, { useMemo, Suspense } from 'react'
import classNames from 'clsx'
import root from 'react-shadow'
import type { Observable } from 'rxjs'
import type { DictID } from '@/app-config'
import { SALADICT_PANEL } from '@/_helpers/saladict'
import type { ViewProps } from '@/components/Dictionaries/helpers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { StaticSpeakerContainer } from '@/components/Speaker'

import dictContentStyles from './DictItemContent.shadow.scss?raw'
import type { Word } from '@P/saladict-core/src/types/word'

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
  const Dict = useMemo(
    () =>
      React.lazy<ComponentType<ViewProps<any>>>(() =>
        import(
          `@/components/Dictionaries/${props.dictID}/View.tsx`
        )
      ),
    [props.dictID]
  )

  const DictStyle = useMemo(
    () =>
      React.lazy(async () => {
        const styleModule = await import(
          /* webpackInclude: /_style\.shadow\.scss$/ */
          /* webpackMode: "lazy" */
          `@/components/Dictionaries/${props.dictID}/_style.shadow.scss`
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
    <p style={{ textAlign: 'center' }}>
      Render error. Please{' '}
      <a
        href="https://github.com/crimx/ext-saladict/issues"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        report issue
      </a>
      .
    </p>
  )
}
