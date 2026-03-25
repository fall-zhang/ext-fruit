import { createFileRoute } from '@tanstack/react-router'

import { useState, useLayoutEffect } from 'react'
import { Tooltip, Row, Col } from 'antd'
import { BlockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { DictTitleMemo } from './-dict-title'
import { EditModal } from './-edit-modal'
import { useUpload } from '../-utils/upload'
import { useListLayout } from '../-utils/layout'
import { useCheckDictAuth } from '../-utils/use-check-dict-auth'
import { getProfilePath } from '../-utils/path-joiner'
import { SaladictModalForm } from '../-components/SaladictModalForm'
import { SortableList } from '../-components/SortableList'
import type { DictID } from '@/core/api-server/config'
import { useConfContext } from '@/context/conf-context'
import { AllDicts } from './-all-dicts'

export const Route = createFileRoute('/configs/dictionaries/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'common', 'dicts'])
  const checkDictAuth = useCheckDictAuth()
  const [editingDict, setEditingDict] = useState<DictID | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const listLayout = useListLayout()
  const confContext = useConfContext()
  const dicts = confContext.profile.dicts

  // const dicts = useDictStore(state => state.activeProfile.dicts)
  const upload = useUpload()

  // make a local copy to avoid flickering on drag end
  const [selectedDicts, setSelectedDicts] = useState<ReadonlyArray<DictID>>(
    dicts.selected
  )
  useLayoutEffect(() => {
    setSelectedDicts(dicts.selected)
  }, [dicts.selected])

  return (
    <Row>
      <Col {...listLayout}>
        <SortableList
          title={
            <Tooltip
              title={t('profile.opt.item_extra')}
              className="saladict-form-profile-title"
            >
              <span>
                <BlockOutlined />
                {t('profile.opt.dict_selected')}
              </span>
            </Tooltip>
          }
          list={selectedDicts.map(id => ({
            value: id,
            title: <DictTitleMemo dictID={id} dictLangs={dicts.all[id].lang} />,
          }))}
          onAdd={async () => {
            if (await checkDictAuth()) {
              setShowAddModal(true)
            }
          }}
          onEdit={index => {
            setEditingDict(selectedDicts[index])
          }}
          onDelete={index => {
            const newList = selectedDicts.slice()
            newList.splice(index, 1)
            upload({
              [getProfilePath('dicts', 'selected')]: newList,
            })
            setSelectedDicts(newList)
          }}
          onOrderChanged={(oldIndex, newIndex) => {
            const newList = reorder(selectedDicts, oldIndex, newIndex)
            upload({
              [getProfilePath('dicts', 'selected')]: newList,
            })
            setSelectedDicts(newList)
          }}
        />
      </Col>
      <SaladictModalForm
        visible={showAddModal}
        title={t('dict.add')}
        onClose={() => setShowAddModal(false)}
        wrapperCol={{ span: 24 }}
        items={[
          {
            name: getProfilePath('dicts', 'selected'),
            label: null,
            help: null,
            extra: null,
            children: <AllDicts />,
          },
        ]} ref={undefined} />
      <EditModal dictID={editingDict} onClose={() => setEditingDict(null)} />
    </Row>
  )
}
