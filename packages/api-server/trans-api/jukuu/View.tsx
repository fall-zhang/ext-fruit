import React, { FC } from 'react'
import { JukuuResult, JukuuPayload, JukuuLang } from './engine'
import { ViewProps } from '@/components/dictionaries/helpers'
import { useTranslation } from 'react-i18next'
import { StrElm } from '@/components/StrElm'

export const DictJukuu: FC<ViewProps<JukuuResult>> = props => {
  const { result, searchText } = props
  const { t } = useTranslation('dicts')
  return (
    <>
      <select
        onChange={e => {
          if (e.target.value) {
            searchText<JukuuPayload>({
              id: 'jukuu',
              payload: {
                lang: e.target.value as JukuuLang
              }
            })
          }
        }}
      >
        <option value="zheng" selected={result.lang === 'zheng'}>
          {t('jukuu.options.lang-zheng')}
        </option>
        <option value="engjp" selected={result.lang === 'engjp'}>
          {t('jukuu.options.lang-engjp')}
        </option>
        <option value="zhjp" selected={result.lang === 'zhjp'}>
          {t('jukuu.options.lang-zhjp')}
        </option>
      </select>
      <ul className="dictJukuu-Sens">
        {result.sens.map((sen, i) => (
          <li key={i} className="dictJukuu-Sen">
            <StrElm tag="p" html={sen.trans} />
            <p className="dictJukuu-Ori">{sen.original}</p>
            <p className="dictJukuu-Src">{sen.src}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default DictJukuu
