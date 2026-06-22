import type { FC } from 'react'
import type React from 'react'
import clsx from 'clsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SpeakerProvider } from '@/components/Speaker'
import type { UnitSearchResult } from '@P/salad-api/src/types/res-type'
import type { DictID } from '@P/salad-api/src/api-trans'
import { WordView } from './word-view/word-view'

export interface DictItemBodyProps {
  dictID: DictID

  withAnimation: boolean

  panelCSS: string

  searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'

  searchResult?: UnitSearchResult

  dictRootRef: React.RefObject<HTMLDivElement | null>

  onSpeakerPlay: (src: string) => Promise<void>

  onInPanelSelect: (e: React.MouseEvent<HTMLElement>) => void
}


export const DictItemBody: FC<DictItemBodyProps> = props => {
  return (
    <>
      {props.searchStatus === 'FINISH' && props.searchResult && (
        <div
          className={clsx(
            'dictRoot',
            { isAnimate: props.withAnimation }
          )}
          onMouseUp={props.onInPanelSelect}
        >
          <SpeakerProvider onPlayStart={props.onSpeakerPlay} >
            {props.searchResult.type === 'word-trans'
              ? <WordView {...props.searchResult} />
              : <></>
            }
          </SpeakerProvider>
        </div>
      )}
    </>
  )
}

function DictRenderError () {
  return (
    <p className='text-neutral-900 dark:text-neutral-200 h-7'>
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
