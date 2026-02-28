import type { FC } from 'react'
import { useState, useLayoutEffect } from 'react'
import { Tooltip, Row, Col } from 'antd'
import { BlockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { DictTitleMemo } from './DictTitle'
import { EditModal } from './EditModal'
import { AllDictsConf } from './AllDicts'
import { useDictStore } from '@P/saladict-core/src/store'
import { useUpload } from '../../../helpers/upload'
import { useListLayout } from '../../../helpers/layout'
import { useCheckDictAuth } from '../../../helpers/use-check-dict-auth'
import { getProfilePath } from '../../../helpers/path-joiner'
import { SaladictModalForm } from '../../SaladictModalForm'
import type { DictID } from '@P/saladict-core/src/app-config'
import { SortableList } from '../../SortableList'

export const Dictionaries: FC = () => {
  const { t } = useTranslation(['options', 'common', 'dicts'])
  const checkDictAuth = useCheckDictAuth()
  const [editingDict, setEditingDict] = useState<DictID | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const listLayout = useListLayout()
  const dicts = useDictStore(state => state.activeProfile.dicts)
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
        ]}
      />
      <EditModal dictID={editingDict} onClose={() => setEditingDict(null)} />
    </Row>
  )
}
