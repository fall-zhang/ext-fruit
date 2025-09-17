import React, { FC } from 'react'
import { Tooltip, Popover } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { useTranslate } from '@/_helpers/i18n'
import { AckList } from './AckList'

import './_style.scss'

export const HeadInfo: FC = () => {
  const { t } = useTranslate('options')
  return (
    <ul className="head-info">
      {process.env.DEBUG || process.env.SDAPP_VETTED
        ? null
        : (
          <li className="head-info-bubble-wrap">
            <Tooltip
              placement="bottom"
              title={decodeURI(
                '%E6%AD%A4%E6%89%A9%E5%B1%95%E5%B7%B2%E8%A2%AB%E5%86%8D%E6%AC%A1%E6%89%93%E5%8C%85%EF%BC%8C%E5%8F%AF%E8%83%BD%E5%B7%B2%E8%A2%AB%E5%8A%A0%E5%85%A5%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81%EF%BC%8C%E8%AF%B7%E5%89%8D%E5%BE%80%E3%80%8C%E6%B2%99%E6%8B%89%E6%9F%A5%E8%AF%8D%E3%80%8D%E5%AE%98%E6%96%B9%E5%BB%BA%E8%AE%AE%E7%9A%84%E5%B9%B3%E5%8F%B0%E5%AE%89%E8%A3%85'
              )}
            >
              <span style={{ color: '#fff' }}>
                <WarningOutlined />{' '}
                {decodeURI('%E6%BD%9C%E5%9C%A8%E5%A8%81%E8%83%81')}
              </span>
            </Tooltip>
          </li>
        )}
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
