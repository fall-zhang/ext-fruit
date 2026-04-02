import type { FC } from 'react'
import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { PreviewIcon } from './PreviewIcon'

import './_style.scss'
import { newWord } from '@/utils/dict-utils/new-word'
import { useSearchContext } from '@/context/search-context'

// pre-fetch the word
// const wordOfToday = getWordOfTheDay()
const wordOfToday = 'awesome'

export const BtnPreview: FC = () => {
  const { t } = useTranslation('options')
  const searchContext = useSearchContext(state => state.searchStart)
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
          searchContext({
            word: newWord({ text: wordOfToday }),
          })
        }}
      />
    </div>
  )
}

export const BtnPreviewMemo = React.memo(BtnPreview)
