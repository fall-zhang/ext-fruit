import type { FC } from 'react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HeadInfoMemo } from './head-info'

import './style.scss'

export const Header: FC = props => {
  const { t } = useTranslation(['options', 'common'])
  const version = useMemo(() => 'v' + '0.0.1', [])


  return (
    <div className='h-16 bg-[#001529] flex  items-center text-neutral-50 justify-center'>
      <div className="w-5xl flex  justify-between">
        <div className="options-header-title">
          <h1>{t('title')}</h1>
          <span>{version}</span>
        </div>
        <HeadInfoMemo />
      </div>
    </div>
  )
}

export const HeaderMemo = React.memo(Header)
