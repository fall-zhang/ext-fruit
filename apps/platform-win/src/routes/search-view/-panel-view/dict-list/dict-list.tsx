import type { FC } from 'react'
import React, { Activity, Suspense, useRef } from 'react'
import { useConfContext } from '@/context/conf-context'
import { DictItem, type DictItemProps } from './dict-list-item'

// const memoizedDicts = memoizeOne((
//   renderedDicts: GlobalState['renderedDicts'],
//   allDict: GlobalState['activeProfile']['dicts']['all']
// ) =>
//   renderedDicts.map(dict => ({
//     dictID: dict.id,
//     searchStatus: dict.searchStatus,
//     searchResult: dict.searchResult,
//     catalog: dict.catalog,
//     preferredHeight: allDict[dict.id].preferredHeight,
//   }))
// )
type DictListItemKeys =
  | 'dictID' |
  'searchStatus' |
  'searchResult'
// extends Omit<
//   DictItemProps, DictListItemKeys | 'onHeightChanged' | 'onInPanelSelect'
// >
export interface DictListProps {
  dicts: Pick<DictItemProps, DictListItemKeys>[]
  // touchMode: AppConfig['touchMode']
  // language: AppConfig['language']
  // newSelection: (payload: {
  //   word: Word | null
  //   mouseX: number
  //   mouseY: number
  //   dbClick: boolean
  //   altKey: boolean
  //   shiftKey: boolean
  //   ctrlKey: boolean
  //   metaKey: boolean
  //   self: boolean
  //   instant: boolean
  //   force: boolean
  // }) => void
}

export const DictList: FC<DictListProps> = (props) => {
  const configContext = useConfContext()

  const { animation } = configContext.config
  const dicts = props.dicts

  return (
    <div className="dictList overflow-hidden">
      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={props.dicts.length > 0 ? 'visible' : 'hidden'}>
          {dicts.map(data => (
            <DictItem
              withAnimation={animation}
              panelCSS={''}
            
              openDictSrcPage={(id, ctrlKey) => {
              }}
              onUserFold={ (id, fold) => {
              }}
              searchText={ (arg) => {
              }}
              onSpeakerPlay={async (src) => {
              }}
              key={data.dictID}
              {...data} />
          ))}
        </Activity>
      </Suspense>
    </div>
  )
}
