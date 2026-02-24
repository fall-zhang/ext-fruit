import type { FC, ReactNode, Ref, RefObject } from 'react'
import React, { useMemo, useState } from 'react'
import { Form, Button, Modal, Tooltip } from 'antd'
import type { FormItemProps, Rule, FormProps, FormInstance } from 'antd/lib/form'
import { ExclamationCircleOutlined, BlockOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'
import { SaveBtn } from './SaveBtn'

import './_style.scss'
import { useDictStore } from '@P/saladict-core/src/store'
import { setFormDirty } from '../../helpers/use-form-dirty'
import { isFirefox } from '@P/saladict-core/src/utils/browser'
import { useUpload } from '../../helpers/upload'

interface FieldValues {
  [name: string]: any
}

interface FieldShow {
  [name: string]: boolean
}

export interface SaladictFormItem
  extends Omit<FormItemProps, 'name' | 'children'> {
  /** Must set name or key. Set name if the item has value. */
  name?: string
  /** Must set name or key. Set key if the item does not carry value. */
  key?: string
  /** Hide item based on other fields */
  hide?: (values: FieldValues) => boolean
  /** Nested items. Must set items or children. */
  items?: SaladictFormItem[]
  /** Must set items or children. */
  children?: ReactNode
}

export interface SaladictFormProps
  extends Omit<FormProps, 'initialValues' | 'onFinish'> {
  items: SaladictFormItem[]
  ref: RefObject<any>
  hideFooter?: boolean
}

export const SaladictForm:FC<SaladictFormProps> = (props) => {
  const { items, hideFooter, ...restProps } = props
  const { t, i18n, ready } = useTranslation(['options', 'common'])
  const store = useDictStore()
  const upload = useUpload()


  const { initialValues } = useMemo(() => {
    function extractInitial (
      items: SaladictFormItem[],
      result: {
        initialValues: { [index: string]: any }
        hideFieldFns: { [index: string]: (values: FieldValues) => boolean }
      } = { initialValues: {}, hideFieldFns: {} }
    ): { [index: string]: any } {
      const newResult = {
        ...result,
      }
      for (const item of items) {
        if (item.items) {
          extractInitial(item.items, newResult)
        } else {
          if (item.hide) {
            newResult.hideFieldFns[(item.key || item.name)!] = item.hide
          }

          if (item.name) {
            const value = get(store, item.name, store)
            if (value !== store) {
              newResult.initialValues[item.name] = value
            }
          }
        }
      }
      return result
    }

    return extractInitial(items)
  },
  [items])

  const [hideFields, setHideFields] = useState< FieldShow >()

  function genFormItems (items: SaladictFormItem[]) {
    return items.map(item => {
      const name = (item.key || item.name)!
      const isProfile = name.startsWith('profile.')
      const newItem = { ...item }
      if (newItem.label === undefined) {
        newItem.label = isProfile
          ? (
            <Tooltip
              title={t('profile.opt.item_extra')}
              className="saladict-form-profile-title"
            >
              <span>
                <BlockOutlined />
                {t(name)}
              </span>
            </Tooltip>
          )
          : (t(name))
      }

      if (newItem.help === undefined) {
        const help = `options:${name}_help`
        if (ready && i18n.exists(help)) {
          newItem.help = t(help)
        }
      }

      if (newItem.extra === undefined) {
        const extra = `options:${name}_extra`
        if (ready && i18n.exists(extra)) {
          newItem.extra = t(extra)
        }
      }

      let { className, children, items: subItems, ...itemProps } = newItem
      if (hideFields?.[name]) {
        className = className ? className + ' saladict-hide' : 'saladict-hide'
      }

      return (
        <Form.Item key={name} {...itemProps} className={className}>
          {subItems ? genFormItems(subItems) : children!}
        </Form.Item>
      )
    })
  }

  const formItems = genFormItems(items)

  return (
    <Form
      {...restProps}
      initialValues={initialValues}
      onFinish={upload}
      onValuesChange={(_, values) => {
        setFormDirty(true)
        //  values => hideFieldFns.map(hide => hide(values))
        setHideFields(values)
        if (props.onValuesChange) {
          props.onValuesChange(_, values)
        }
      }}
      labelAlign='left'
      ref={props.ref}
    >
      {formItems}
      {!hideFooter && (
        <Form.Item wrapperCol={ { offset: 6, span: 18 } } className="saladict-form-btns">
          <SaveBtn />
          <Button
            onClick={() => {
              if (isFirefox) {
                Modal.info({ content: t('firefox_shortcuts') })
              } else {
                // openUrl('chrome://extensions/shortcuts')
              }
            }}
          >
            {t('shortcuts')}
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              Modal.confirm({
                title: t('config.opt.reset_confirm'),
                icon: <ExclamationCircleOutlined />,
                okType: 'danger',
                onOk: async () => {
                  // await resetConfig()
                  // await resetAllProfiles()
                  setFormDirty(false)
                },
              })
            }}
          >
            {t('config.opt.reset')}
          </Button>
        </Form.Item>
      )}
    </Form>
  )
}

export const NUMBER_RULES: Rule[] = [
  { type: 'number', whitespace: true, required: true },
]

export const percentageSlideFormatter = (v?: number) => `${v || 0}%`

export const pixelSlideFormatter = (v?: number) => `${v || 0}px`
