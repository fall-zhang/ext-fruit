import type { FC } from 'react'
import { useMemo } from 'react'
import { Card, List, Switch } from 'antd'
import { DictTitle } from './-dict-title'
import { useConfContext } from '@/context/conf-context'
import type { DictID } from '@/core/api-server/config'

export interface AllDictsProps {
  value?: DictID[]
  onChange?: (list: DictID[]) => void
}

/**
 * Antd form item compatible list
 */
export const AllDicts: FC<AllDictsProps> = props => {
  // const allDicts = useDictStore(state => state.activeProfile.dicts.all)
  const confContext = useConfContext()

  const allDicts = confContext.profile.dicts.all

  const allDictIds = useMemo<DictID[]>(() => Object.keys(allDicts) as DictID[], [allDicts])
  const selected = useMemo(() => new Set(props.value || []), [props.value])

  return (
    <>
      {
        allDictIds.map(dictID => {
          return (
            <div key={dictID} className="sortable-list-item">
              <DictTitle dictID={dictID} dictLangs={allDicts[dictID].lang} />
              <Switch
                checked={selected.has(dictID)}
                onChange={checked => {
                  if (props.onChange && props.value) {
                    props.onChange(
                      checked
                        ? [...props.value, dictID]
                        : props.value.filter(id => id !== dictID)
                    )
                  }
                }}
              />
            </div>
          )
        })
      }
      <ul>
        {allDictIds.map(item => (<div className="sortable-list-item" key={item}>
          <DictTitle dictID={item} dictLangs={allDicts[item].lang} />
          <Switch
            checked={selected.has(item)}
            onChange={checked => {
              if (props.onChange && props.value) {
                props.onChange(
                  checked
                    ? [...props.value, item]
                    : props.value.filter(id => id !== item)
                )
              }
            }}
          />
        </div>)
        )
        }</ul>
    </>
  )
}
