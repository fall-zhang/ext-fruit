import type { FC } from 'react'
import React from 'react'
import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { AckList } from './head-info-ack'

import './style.scss'

export const HeadInfo: FC = () => {
  const { t } = useTranslation('options')
  return (
    <ul className="head-info">
      <li className="head-info-bubble-wrap head-info-unin">
        <Popover placement="bottomRight" content={<AckList />}>
          <a
            href="https://github.com/crimx/ext-saladict/wiki#acknowledgement"
            onClick={preventDefault}
          >
            {t('headInfo.acknowledgement.title')}
          </a>
        </Popover>
      </li>
      <li>
        <a
          href="https://saladict.crimx.com/manual.html"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {t('headInfo.instructions')}
        </a>
      </li>
      <li>
        <a
          href="https://saladict.crimx.com/support.html"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          💪{t('headInfo.donate')}
        </a>
      </li>
      <li>
        <a
          href="https://github.com/crimx/ext-saladict/issues"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {t('headInfo.report_issue')}
        </a>
      </li>
    </ul>
  )
}

export const HeadInfoMemo = React.memo(HeadInfo)

function preventDefault (e: React.MouseEvent<HTMLElement>) {
  e.preventDefault()
}
