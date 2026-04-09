import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'
import { useState, useLayoutEffect } from 'react'
import { Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { SortableList, reorder } from '../-components/SortableList'
import { AddModal } from './-add-modal'
import { EditModal } from './-edit-modal'
import { useDictStore } from '@/store'
import { getConfigPath } from '../-utils/path-joiner'
import { useUpdateSetting } from '../-utils/upload'
import { useListLayout } from '../-utils/layout'
import { useConfContext } from '@/context/conf-context'

export const Route = createFileRoute('/configs/context-menus/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'common', 'menus'])
  const upload = useUpdateSetting()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMenu, setEditingMenu] = useState<string | null>(null)
  const listLayout = useListLayout()

  // make a local copy to avoid flickering on drag end
  const [selectedMenus, setSelectedMenus] = useState<ReadonlyArray<string>>([])

  return (
    <Row>
      <Col {...listLayout}>
        <SortableList
          title={t('nav.ContextMenus')}
          description={<p>{t('config.opt.contextMenus_description')}</p>}
          list={selectedMenus.map(id => {
            return {
              value: id,
              title: t(`menus:${id}`),
            }
          })}
          disableEdit={(index, item) => { return false }}
          onAdd={() => setShowAddModal(true)}
          onEdit={index => {
            setEditingMenu(selectedMenus[index])
          }}
          onDelete={index => {
            const newList = selectedMenus.slice()
            newList.splice(index, 1)
            setSelectedMenus(newList)
          }}
          onOrderChanged={(oldIndex, newIndex) => {
            const newList = reorder(selectedMenus, oldIndex, newIndex)
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
