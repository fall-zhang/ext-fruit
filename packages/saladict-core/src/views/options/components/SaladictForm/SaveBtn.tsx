import { useState, type FC } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * Move the button out as independent component to reduce
 * re-rendering of the whole component.
 */
export const SaveBtn: FC = () => {
  const { t } = useTranslation('common')
  const [uploadStatus] = useState<'idle' | 'uploading' | 'error'>('idle')

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={uploadStatus === 'uploading'}
    >
      {t('common:save')}
    </Button>
  )
}
