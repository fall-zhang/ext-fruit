import type { FC } from 'react'
import React, { useMemo } from 'react'
import { List, Modal, Button, Tooltip } from 'antd'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { useUpdateSetting } from '../-utils/upload'

export interface AddModalProps {
  show: boolean
  onEdit: (menuID: string) => void
  onClose: () => void
}

export const AddModal: FC<AddModalProps> = ({ show, onEdit, onClose }) => {
  const { t } = useTranslation(['common', 'menus', 'options'])
  // const contextMenus = useDictStore(state => state.config.contextMenus)
  // const contextMenus = useConfContext().config.contextMenus
  const unselected = useMemo(() => {
    // if (!contextMenus) {
    //   return []
    // }
    return []

    // const selectedSet = new Set(contextMenus.selected as string[])
    // return Object.keys(contextMenus.all).filter(id => !selectedSet.has(id))
  }, [])
  const upload = useUpdateSetting()

  return (
    <Modal
      open={show}
      title={t('common:add')}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
    >
      <Button type="dashed" block onClick={addItem}>
        {t('common:add')}
      </Button>
      {/* <List dataSource={unselected} renderItem={renderListItem} /> */}
      <Button type="dashed" block onClick={addItem}>
        {t('common:add')}
      </Button>
    </Modal>
  )

  function renderListItem (menuID: string) {
    // if (!contextMenus) return null

    // const item = contextMenus.all[menuID]
    // const itemName = typeof item === 'string' ? t(`menus:${menuID}`) : ''
    // return (
    //   <List.Item>
    //     <div className="sortable-list-item">
    //       <span>{itemName}</span>
    //       <Button
    //         title={t('common:edit')}
    //         className="sortable-list-item-btn"
    //         shape="circle"
    //         size="small"
    //         icon={<EditOutlined />}
    //         disabled={item === 'x' /** internal options */}
    //         onClick={() => onEdit(menuID)}
    //       />
    //       <Button
    //         title={t('common:delete')}
    //         disabled={item === 'x' /** internal options */}
    //         className="sortable-list-item-btn"
    //         shape="circle"
    //         size="small"
    //         icon={<CloseOutlined />}
    //         onClick={deleteItem}
    //       />
    //     </div>
    //   </List.Item>
    // )

    // function selectItem () {
    //   if (!contextMenus) return

    //   upload({
    //     [getConfigPath('contextMenus', 'selected')]: [
    //       ...contextMenus.selected,
    //       menuID,
    //     ],
    //   })
    // }

    // function deleteItem () {
    //   if (!contextMenus) return

    //   Modal.confirm({
    //     title: t('common:delete_confirm'),
    //     okType: 'danger',
    //     onOk: () => {
    //       if (contextMenus.all[menuID] !== 'x') {
    //         upload({
    //           [getConfigPath('contextMenus')]: {
    //             ...contextMenus,
    //             selected: contextMenus.selected.filter(id => id !== menuID),
    //             all: omit(contextMenus.all, [menuID]),
    //           },
    //         })
    //       }
    //     },
    //   })
    // }
  }

  function addItem () {
    onEdit(`c_${uuid()}`)
  }
}
