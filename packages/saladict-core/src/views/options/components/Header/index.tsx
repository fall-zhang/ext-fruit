import type { FC } from 'react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HeadInfoMemo } from './head-info'

import './style.scss'

export const Header: FC = props => {
  const { t } = useTranslation(['options', 'common'])
  const version = useMemo(() => 'v' + '0.0.1', [])


  return (
    <div className='h-16 bg-[#001529] flex justify-between items-center text-neutral-50'>
      <div className="options-header-title">
        <h1>{t('title')}</h1>
        <span>{version}</span>
      </div>

      <HeadInfoMemo />
    </div>
  )
}

export const HeaderMemo = React.memo(Header)
