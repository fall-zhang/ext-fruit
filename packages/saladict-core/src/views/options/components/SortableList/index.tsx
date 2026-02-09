import type React from 'react'
import { List, Radio, Button, Card } from 'antd'
import {
  PlusOutlined,
  SwapOutlined,
  EditOutlined,
  CloseOutlined
} from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd/lib/radio'

import './_style.scss'
import { useTranslation } from 'react-i18next'

export { reorder } from './reorder'

export type SortableListItem = { value: string; title: React.ReactNode }

export interface SortableListItemProps {
  indexCopy: number
  selected?: string
  item: SortableListItem
  disableEdit?: (index: number, item: SortableListItem) => boolean
  onEdit?: (index: number, item: SortableListItem) => void
  onDelete?: (index: number, item: SortableListItem) => void
}

export interface SortableListProps
  extends Omit<SortableListItemProps, 'item' | 'indexCopy'> {
  /** List title */
  title: React.ReactNode
  description?: React.ReactNode
  list: SortableListItem[]
  /** List Item can be selected */
  selected?: string
  /** show add button */
  isShowAdd?: boolean
  onAdd?: () => void
  /** Title being selected */
  onSelect?: (e: RadioChangeEvent) => void
  onOrderChanged?: (oldIndex: number, newIndex: number) => void
}

export function SortableList (props: SortableListProps) {
  const { t } = useTranslation('common')

  return (
    <Card
      title={props.title}
      extra={
        <Button type="dashed" size="small" onClick={props.onAdd}>
          <PlusOutlined />
          {t('add')}
        </Button>
      }
    >
      {props.description}
      <Radio.Group
        className="sortable-list-radio-group"
        value={props.selected}
        onChange={props.onSelect}
      >
        <List size="large">
          {props.list.map((item, index) => (
            <List.Item key={item.value}>
              <div className="sortable-list-item">
                {props.selected == null
                  ? (
                    item.title
                  )
                  : (
                    <Radio value={item.value}>{item.title}</Radio>
                  )}
                <div className="sortable-list-item-btns">
                  <SwapOutlined
                    rotate={90}
                    title={t('sort')}
                    style={{ cursor: 'move' }}
                  />
                  <Button
                    className="sortable-list-item-btn"
                    title={t('edit')}
                    shape="circle"
                    size="small"
                    icon={<EditOutlined />}
                    disabled={
                      props.disableEdit != null &&
                                    props.disableEdit(index, item)
                    }
                    onClick={() =>
                      props.onEdit && props.onEdit(index, item)
                    }
                  />
                  <Button
                    title={t('delete')}
                    className="sortable-list-item-btn"
                    shape="circle"
                    size="small"
                    disabled={ props.selected != null && item.value === props.selected }
                    onClick={() =>
                      props.onDelete?.(index, item)
                    }
                  ><CloseOutlined /></Button>
                </div>
              </div>
            </List.Item>
          ))}
        </List>

      </Radio.Group>
      {(props.isShowAdd == null || props.isShowAdd) && (
        <Button type="dashed" style={{ width: '100%' }} onClick={props.onAdd}>
          <PlusOutlined /> {t('add')}
        </Button>
      )}
    </Card>
  )
}
