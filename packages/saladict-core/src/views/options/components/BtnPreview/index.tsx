import type { FC } from 'react'
import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'
import { PreviewIcon } from './PreviewIcon'

import './_style.scss'
import { useDictStore } from '@P/saladict-core/src/store'
import { getWordOfTheDay } from '@P/saladict-core/src/utils/everyday-word'

// pre-fetch the word
// const pWordOfTheDay = getWordOfTheDay()

export const BtnPreview: FC = () => {
  const { t } = useTranslation('options')
  const store = useDictStore((state) => state)
  return (
    <div>
      <Button
        className="btn-preview"
        title={t('previewPanel')}
        shape="circle"
        size="large"
        icon={<PreviewIcon />}
        onClick={async e => {
          // const { x, width } = e.currentTarget.getBoundingClientRect()
          // panel will adjust the position itself
          // store.OPEN_PANEL({ x: x + width, y: 80 })
          store.SEARCH_START({
            word: newWord({ text: await pWordOfTheDay }),
          })
        }}
      />
    </div>
  )
}

export const BtnPreviewMemo = React.memo(BtnPreview)
