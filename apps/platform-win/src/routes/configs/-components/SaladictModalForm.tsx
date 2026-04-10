import type { FC, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@salad/ui/components/dialog'
import { Button } from '@salad/ui/components/button'
import { useTranslation } from 'react-i18next'

import { SaladictForm, type SaladictFormItem, type SaladictFormProps } from './SaladictForm'
import { setFormDirty, useFormDirty } from '../-utils/use-form-dirty'

export interface SaladictModalFormProps
  extends Omit<SaladictFormProps, 'title' | 'ref'> {
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
  const formRef = useRef<any>(null)

  useUpdateEffect(() => {
    if (visible && uploadStatus === 'idle') {
      onClose()
    }
  }, [uploadStatus])

  const handleCancel = () => {
    if (formDirtyRef.value) {
      // 使用浏览器原生 confirm 或者项目中的 confirm context
      if (window.confirm(t('unsave_confirm'))) {
        setFormDirty(false)
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent style={{ zIndex }} className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <SaladictForm
          hideFooter
          {...restProps}
          ref={formRef}
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('common:cancel')}
          </Button>
          <Button
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit()
              }
            }}
          >
            {t('common:save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
