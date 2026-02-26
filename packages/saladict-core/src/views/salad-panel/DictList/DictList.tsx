import type { FC } from 'react'
import React, { useRef } from 'react'
import type { AppConfig, DictID } from '@P/saladict-core/src/app-config'
import type { Word } from '@P/saladict-core/src/types/word'
import { useInPanelSelect } from '@P/saladict-core/src/utils/selection/select-text'
import memoizeOne from 'memoize-one'
import type { GlobalState } from '@P/saladict-core/src/store/global-state'
import { useConfContext } from '@P/saladict-core/src/context/conf-context'
import { DictItem, type DictItemProps } from './dict-list-item/dict-list-item'
import { useDictStore } from '@P/saladict-core/src/store'

const MemoDictItem = React.memo(DictItem)
const memoizedDicts = memoizeOne((
  renderedDicts: GlobalState['renderedDicts'],
  allDict: GlobalState['activeProfile']['dicts']['all']
) =>
  renderedDicts.map(dict => ({
    dictID: dict.id,
    searchStatus: dict.searchStatus,
    searchResult: dict.searchResult,
    catalog: dict.catalog,
    preferredHeight: allDict[dict.id].preferredHeight,
  }))
)
type DictListItemKeys =
  | 'dictID' |
  'preferredHeight' |
  'searchStatus' |
  'searchResult'

export interface DictListProps extends Omit<
  DictItemProps, DictListItemKeys | 'onHeightChanged' | 'onInPanelSelect'
> {
  dicts: Pick<DictItemProps, DictListItemKeys>[]
  touchMode: AppConfig['touchMode']
  language: AppConfig['language']
  newSelection: (payload: {
    word: Word | null
    mouseX: number
    mouseY: number
    dbClick: boolean
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    self: boolean
    instant: boolean
    force: boolean
  }) => void
}

export const DictList: FC = () => {
  const configContext = useConfContext()

  const {
    touchMode,
    animation,
    language,
    darkMode,
  } = configContext.config
  const dicts = []
  // const { dicts } = useDictStore((store) => {
  //   return {
  //     dicts: store.renderedDicts memoizedDicts(store.renderedDicts, store.activeProfile.dicts.all),
  //   }
  // })
  // const {
  //   dicts,
  //   touchMode,
  //   language,
  //   withAnimation,
  //   darkMode,
  // } = useDictStore(store => {
  //   const { config } = store
  //   return {
  //     darkMode: config.darkMode,
  //     withAnimation: config.animation,
  //     panelCSS: config.panelCSS,
  //     touchMode: config.touchMode,
  //     language: config.language,
  //     dicts: memoizedDicts(store.renderedDicts, store.activeProfile.dicts.all),
  //   }
  // })

  // const heightRef = useRef<Height>({ dicts: {}, sum: 0 })

  function onUpdateHeight (height:number) {
    // setUpdateHeight(height)
  }

  const onItemHeightChanged = useRef((id: DictID, height: number) => {
    // heightRef.current.sum =
    //   heightRef.current.sum - (heightRef.current.dicts[id] || 0) + height
    // heightRef.current.dicts[id] = height
    // onUpdateHeight(heightRef.current.sum)
  }).current

  // const dictIds = useMemo(
  //   () => dicts.reduce((idStr, { dictID }) => idStr + dictID + ',', ''),
  //   [dicts]
  // )

  // useEffect(() => {
  //   const oldHeight = heightRef.current
  //   heightRef.current = dicts.reduce(
  //     (height, { dictID }:{ dictID:DictID }) => {
  //       height.dicts[dictID] = oldHeight.dicts[dictID] || 30
  //       height.sum += height.dicts[dictID] || 30
  //       return height
  //     },
  //     { dicts: {}, sum: 0 } as Height
  //   )
  //   onUpdateHeight(heightRef.current.sum)
  // }, [dicts])

  const onInPanelSelect = useInPanelSelect(
    touchMode,
    language
  )

  return (
    <div className="dictList">
      {dicts.map(data => (
        <MemoDictItem
          withAnimation={animation}
          darkMode={darkMode}
          panelCSS={''}
          openDictSrcPage={(id: DictID, ctrlKey: boolean) => {
            throw new Error('Function not implemented.')
          } }
          onUserFold={function (id: DictID, fold: boolean): void {
            throw new Error('Function not implemented.')
          } }
          searchText={function (arg?: { id?: DictID; word?: Word; payload?: { [index: string]: any } }) {
            throw new Error('Function not implemented.')
          } }
          onSpeakerPlay={function (src: string): Promise<void> {
            throw new Error('Function not implemented.')
          } }
          key={data.dictID}
          {...data}
          onInPanelSelect={onInPanelSelect}
          onHeightChanged={onItemHeightChanged} />
      ))}
    </div>
  )
}
