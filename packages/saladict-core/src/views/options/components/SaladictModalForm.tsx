import type { FC, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import { Modal } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import { SaladictForm, type SaladictFormItem, type SaladictFormProps } from './SaladictForm'
import { formItemModalLayout } from '../helpers/layout'
import { setFormDirty, useFormDirty } from '../helpers/use-form-dirty'

export interface SaladictModalFormProps
  extends Omit<SaladictFormProps, 'title'> {
  visible: boolean
  title: ReactNode
  zIndex?: number
  items: SaladictFormItem[]
  onClose: () => void
}

export const SaladictModalForm: FC<SaladictModalFormProps> = props => {
  const { visible, title, zIndex, onClose, ...restProps } = props
  const { t } = useTranslation('options')
  const [uploadStatus] = useState('idle')
  const formDirtyRef = useFormDirty()
  const formRef = useRef<FormInstance>(null)

  useUpdateEffect(() => {
    if (visible && uploadStatus === 'idle') {
      onClose()
    }
  }, [uploadStatus])

  return (
    <Modal
      open={visible}
      title={title}
      zIndex={zIndex}
      width={600}
      destroyOnClose
      onOk={() => {
        if (formRef.current) {
          formRef.current.submit()
        }
      }}
      onCancel={() => {
        if (formDirtyRef.value) {
          Modal.confirm({
            title: t('unsave_confirm'),
            icon: <ExclamationCircleOutlined />,
            okType: 'danger',
            onOk: () => {
              setFormDirty(false)
              onClose()
            },
          })
        } else {
          onClose()
        }
      }}
    >
      <SaladictForm
        {...formItemModalLayout}
        hideFooter
        {...restProps}
        ref={formRef}
      />
    </Modal>
  )
}
