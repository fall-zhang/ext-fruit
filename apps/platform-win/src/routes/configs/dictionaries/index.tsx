/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'

import { useState, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { DictTitleMemo } from './-dict-title'
import { useUpdateSetting } from '../-utils/upload'
import { getProfilePath } from '../-utils/path-joiner'
import { reorder, SortableList } from '../-components/SortableList'
import { useConfContext } from '@/context/conf-context/context'
import { DictSortableList } from './-components/sortable-list'
import type { DictID } from '@P/salad-api/src/api-trans'

export const Route = createFileRoute('/configs/dictionaries/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'common', 'dicts'])
  const [editingDict, setEditingDict] = useState<DictID | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const confContext = useConfContext()
  const dicts = confContext.profile

  // const dicts = useDictStore(state => state.activeProfile.dicts)
  const upload = useUpdateSetting()

  // make a local copy to avoid flickering on drag end
  const [selectedDicts, setSelectedDicts] = useState<ReadonlyArray<DictID>>(
    dicts.selectDict
  )
  useLayoutEffect(() => {
    setSelectedDicts(dicts.selectDict)
  }, [dicts.selectDict])
  return (
    <div className='flex flex-col'>
      <span>
        {t('profile.opt.dict_selected')}
      </span>
      <DictSortableList></DictSortableList>
      <SortableList
        title={''}
        list={selectedDicts.map(id => ({
          value: id,
          title: <DictTitleMemo dictID={id} dictLangs={dicts.all[id].lang} />,
        }))}
        onAdd={async () => {
          setShowAddModal(true)
        }}
        onEdit={index => {
          setEditingDict(selectedDicts[index])
        }}
        onDelete={index => {
          const newList = selectedDicts.slice()
          newList.splice(index, 1)
          upload({
            [getProfilePath('selectDict')]: newList,
          })
          setSelectedDicts(newList)
        }}
        onOrderChanged={(oldIndex, newIndex) => {
          const newList = reorder(selectedDicts, oldIndex, newIndex)
          upload({
            [getProfilePath('selectDict')]: newList,
          })
          setSelectedDicts(newList)
        }}
      />
    </div>
  )
}
