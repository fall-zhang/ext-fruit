import React, { FC, useMemo } from 'react'
import { List, Modal, Button, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import omit from 'lodash/omit'
import { v4 as uuid } from 'uuid'
import { getConfigPath } from '@/options/helpers/path-joiner'
import { useUpload } from '@/options/helpers/upload'
import { useTranslate } from '@P/saladict-core/src/locales/i18n'
import { isFirefox } from '@P/saladict-core/src/utils/browser'
import { useDictStore } from '@P/saladict-core/src/store'

/**
 * key: menu id
 * value: reason
 */
const unsupportedFeatures: Readonly<{ [id: string]: 'ff' | '' }> = {
  caiyuntrs: isFirefox ? 'ff' : '',
  youdao_page_translate: isFirefox ? 'ff' : ''
}

export interface AddModalProps {
  show: boolean
  onEdit: (menuID: string) => void
  onClose: () => void
}

export const AddModal: FC<AddModalProps> = ({ show, onEdit, onClose }) => {
  const { t } = useTranslate(['common', 'menus', 'options'])
  const contextMenus = useDictStore(state => state.config.contextMenus)
  const unselected = useMemo(() => {
    if (!contextMenus) {
      return []
    }

    const selectedSet = new Set(contextMenus.selected as string[])
    return Object.keys(contextMenus.all).filter(id => !selectedSet.has(id))
  }, [contextMenus])
  const upload = useUpload()

  return (
    <Modal
      open={show}
      title={t('common:add')}
      destroyOnHidden
      onOk={onClose}
      onCancel={onClose}
      footer={null}
    >
      <Button type="dashed" block onClick={addItem}>
        {t('common:add')}
      </Button>
      <List dataSource={unselected} renderItem={renderListItem} />
      <Button type="dashed" block onClick={addItem}>
        {t('common:add')}
      </Button>
    </Modal>
  )

  function renderListItem (menuID: string) {
    if (!contextMenus) return null

    const item = contextMenus.all[menuID]
    const itemName = typeof item === 'string' ? t(`menus:${menuID}`) : item.name
    return (
      <List.Item>
        <div className="sortable-list-item">
          {itemName}
          <div>
            <div>
              <Tooltip
                title={
                  unsupportedFeatures[menuID]
                    ? t(
                      `options:unsupportedFeatures.${unsupportedFeatures[menuID]}`,
                      { feature: itemName }
                    )
                    : ''
                }
              >
                <Button
                  title={t('common:add')}
                  className="sortable-list-item-btn"
                  shape="circle"
                  size="small"
                  icon={<CheckOutlined />}
                  disabled={!!unsupportedFeatures[menuID]}
                  onClick={selectItem}
                />
              </Tooltip>
              <Button
                title={t('common:edit')}
                className="sortable-list-item-btn"
                shape="circle"
                size="small"
                icon={<EditOutlined />}
                disabled={item === 'x' /** internal options */}
                onClick={() => onEdit(menuID)}
              />
              <Button
                title={t('common:delete')}
                disabled={item === 'x' /** internal options */}
                className="sortable-list-item-btn"
                shape="circle"
                size="small"
                icon={<CloseOutlined />}
                onClick={deleteItem}
              />
            </div>
          </div>
        </div>
      </List.Item>
    )

    function selectItem () {
      if (!contextMenus) return

      upload({
        [getConfigPath('contextMenus', 'selected')]: [
          ...contextMenus.selected,
          menuID
        ]
      })
    }

    function deleteItem () {
      if (!contextMenus) return

      Modal.confirm({
        title: t('common:delete_confirm'),
        okType: 'danger',
        onOk: () => {
          if (contextMenus.all[menuID] !== 'x') {
            upload({
              [getConfigPath('contextMenus')]: {
                ...contextMenus,
                selected: contextMenus.selected.filter(id => id !== menuID),
                all: omit(contextMenus.all, [menuID])
              }
            })
          }
        }
      })
    }
  }

  function addItem () {
    onEdit(`c_${uuid()}`)
  }
}
