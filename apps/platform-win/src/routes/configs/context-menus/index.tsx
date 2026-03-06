import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'
import { useState, useLayoutEffect } from 'react'
import { Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { SortableList, reorder } from '../../SortableList'
import { AddModal } from './AddModal'
import { EditModal } from './EditeModal'
import { useDictStore } from '@P/saladict-core/src/store'
import { getConfigPath } from '../-utils/path-joiner'
import { useUpload } from '../-utils/upload'
import { useListLayout } from '../../../helpers/layout'

export const Route = createFileRoute('/configs/context-menus/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'common', 'menus'])
  const upload = useUpload()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMenu, setEditingMenu] = useState<string | null>(null)
  const listLayout = useListLayout()
  const contextMenus = useDictStore(state => state.config.contextMenus)
  // make a local copy to avoid flickering on drag end
  const [selectedMenus, setSelectedMenus] = useState<ReadonlyArray<string>>(
    contextMenus.selected
  )
  useLayoutEffect(() => {
    setSelectedMenus(contextMenus.selected)
  }, [contextMenus.selected])

  return (
    <Row>
      <Col {...listLayout}>
        <SortableList
          title={t('nav.ContextMenus')}
          description={<p>{t('config.opt.contextMenus_description')}</p>}
          list={selectedMenus.map(id => {
            const item = contextMenus.all[id]
            return {
              value: id,
              title: typeof item === 'string' ? t(`menus:${id}`) : item.name,
            }
          })}
          disableEdit={(index, item) => contextMenus.all[item.value] === 'x'}
          onAdd={() => setShowAddModal(true)}
          onEdit={index => {
            setEditingMenu(selectedMenus[index])
          }}
          onDelete={index => {
            const newList = selectedMenus.slice()
            newList.splice(index, 1)
            upload({
              [getConfigPath('contextMenus', 'selected')]: newList,
            })
            setSelectedMenus(newList)
          }}
          onOrderChanged={(oldIndex, newIndex) => {
            const newList = reorder(selectedMenus, oldIndex, newIndex)
            upload({
              [getConfigPath('contextMenus', 'selected')]: newList,
            })
            setSelectedMenus(newList)
          }}
        />
      </Col>
      <AddModal
        show={showAddModal}
        onEdit={setEditingMenu}
        onClose={() => setShowAddModal(false)}
      />
      <EditModal menuID={editingMenu} onClose={() => setEditingMenu(null)} />
    </Row>
  )
}
