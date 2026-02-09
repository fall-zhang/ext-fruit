import type { FC } from 'react'
import React, { useEffect, useRef, useMemo, useState } from 'react'
import type { DictItemProps } from '../DictItem/DictItem'
import { DictItem } from '../DictItem/DictItem'
import type { AppConfig, DictID } from '@P/saladict-core/src/app-config'
import type { Word } from '@P/saladict-core/src/types/word'
import { useInPanelSelect } from '@P/saladict-core/src/selection/select-text'

const MemoDictItem = React.memo(DictItem)

type DictListItemKeys =
  | 'dictID' |
  'preferredHeight' |
  'searchStatus' |
  'searchResult' |
  'TestComp'

export interface DictListProps
  extends Omit<
    DictItemProps,
    DictListItemKeys | 'onHeightChanged' | 'onInPanelSelect'
  > {
  dicts: Pick<DictItemProps, DictListItemKeys>[]
  onHeightChanged: (height: number) => void

  touchMode: AppConfig['touchMode']
  language: AppConfig['language']
  doubleClickDelay: AppConfig['doubleClickDelay']
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

type Height = {
  dicts: { [key in DictID]?: number }
  sum: number
}

export const DictList: FC<DictListProps> = props => {
  const {
    dicts,
    onHeightChanged,
    touchMode,
    language,
    doubleClickDelay,
    newSelection,
    ...restProps
  } = props

  const heightRef = useRef<Height>({ dicts: {}, sum: 0 })
  const [updateHeight, setUpdateHeight] = useState<number>()

  function onUpdateHeight (height:number) {
    onHeightChanged(height)
    setUpdateHeight(height)
  }

  const onItemHeightChanged = useRef((id: DictID, height: number) => {
    heightRef.current.sum =
      heightRef.current.sum - (heightRef.current.dicts[id] || 0) + height
    heightRef.current.dicts[id] = height
    onUpdateHeight(heightRef.current.sum)
  }).current

  // const dictIds = useMemo(
  //   () => dicts.reduce((idStr, { dictID }) => idStr + dictID + ',', ''),
  //   [dicts]
  // )

  useEffect(() => {
    const oldHeight = heightRef.current
    heightRef.current = dicts.reduce(
      (height, { dictID }:{ dictID:DictID }) => {
        height.dicts[dictID] = oldHeight.dicts[dictID] || 30
        height.sum += height.dicts[dictID] || 30
        return height
      },
      { dicts: {}, sum: 0 } as Height
    )
    onUpdateHeight(heightRef.current.sum)
  }, [dicts])

  const onInPanelSelect = useInPanelSelect(
    touchMode,
    language
  )

  return (
    <div className="dictList">
      {dicts.map(data => (
        <MemoDictItem
          key={data.dictID}
          {...restProps}
          {...data}
          onInPanelSelect={onInPanelSelect}
          onHeightChanged={onItemHeightChanged}
        />
      ))}
    </div>
  )
}
