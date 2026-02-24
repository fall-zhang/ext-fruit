/* eslint-disable no-param-reassign */
import type { FC } from 'react'
import React, { useRef } from 'react'
import { useUpdateEffect } from 'react-use'
import { useObservableState } from 'observable-hooks'
import { Form, Modal, Button } from 'antd'
import type { FormInstance, Rule } from 'antd/lib/form'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { matchPatternToRegExpStr } from '@P/saladict-core/src/utils/matchPatternToRegExpStr'
import { PatternItem } from './ PatternItem'
import { useTranslation } from 'react-i18next'
import { getConfigPath } from '../../helpers/path-joiner'
import { useUpload } from '../../helpers/upload'


export interface MatchPatternModalProps {
  area: null | 'whitelist' | 'blacklist'
  onClose: () => void
}

export const MatchPatternModal: FC<MatchPatternModalProps> = ({
  area,
  onClose,
}) => {
  const { t } = useTranslation()
  const formRef = useRef<FormInstance>(null)
  const uploadStatus = 'idle'

  const upload = useUpload()

  useUpdateEffect(() => {
    if (area && uploadStatus === 'idle') {
      onClose()
    }
  }, [uploadStatus])

  const title = area
    ? (area.startsWith('pdf') ? 'PDF ' : '') +
      t(area.endsWith('hitelist') ? 'common:whitelist' : 'common:blacklist')
    : t('nav.BlackWhiteList')

  async function validatePatterns (rule: Rule, value: [string, string]) {
    if (value[1]) {
      // url
      value[0] = matchPatternToRegExpStr(value[1])
      if (!value[0]) {
        throw new Error(t('matchPattern.url_error'))
      }
    } else if (value[0]) {
      // regex
      try {
        RegExp(value[0])
      } catch (e) {
        throw new Error(t('matchPattern.regex_error'))
      }
    }
  }

  return (
    <Modal
      visible={!!area}
      title={title}
      destroyOnClose
      onOk={() => {
        if (formRef.current) {
          formRef.current.submit()
        }
      }}
      onCancel={() => {
        if (formRef.current && formRef.current.isFieldsTouched()) {
          Modal.confirm({
            title: t('unsave_confirm'),
            icon: <ExclamationCircleOutlined />,
            okType: 'danger',
            onOk: onClose,
          })
        } else {
          onClose()
        }
      }}
    >
      <p>
        <a
          href="https://developer.mozilla.org/zh-CN/Add-ons/WebExtensions/Match_patterns#范例"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {t('matchPattern.url')}
        </a>
        <a
          href="https://deerchao.cn/tutorials/regex/regex.htm"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {t('matchPattern.regex')}
        </a>
      </p>
      <Form
        ref={formRef}
        wrapperCol={{ span: 24 }}
        initialValues={{}}
        onFinish={values => {
          if (area) {
            const patterns: [string, string][] | undefined = values.patterns
            upload({
              [getConfigPath(area)]: (patterns || []).filter(p => p[0]),
            })
          }
        }}
      >
        <Form.List name="patterns">
          {(fields, { add }) => (
            <div>
              {fields.map(field => (
                <Form.Item
                  {...field}
                  key={field.key}
                  validateTrigger={['onChange', 'onBlur']}
                  hasFeedback
                  rules={[{ validator: validatePatterns }]}
                >
                  <PatternItem />
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" block onClick={() => add(['', ''])}>
                  <PlusOutlined /> {t('common:add')}
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}
