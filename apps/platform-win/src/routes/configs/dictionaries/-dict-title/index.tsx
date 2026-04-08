import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import './_style.scss'
import type { DictID } from '@/core/api-server/config'
export interface DictTitleProps {
  dictID: DictID
  /** Supported languages */
  dictLangs: string
}

const langCodes = ['en', 'zhs', 'zht', 'ja', 'kor', 'fr', 'de', 'es'] as const

export const DictTitle: FC<DictTitleProps> = ({ dictID, dictLangs }) => {
  const { t } = useTranslation(['options', 'dicts'])
  const title = t(`dicts:${dictID}.name`)

  return (
    <div className="saladict-dict-title flex items-center justify-start">
      <img
        className="saladict-dict-title-icon"
        src={'/src/core/api-server/trans-api/' + dictID + '/favicon.png'}
        // /src/core/api-server/trans-api/bing/favicon.png
        alt={`logo ${title}`}
      />
      <a
        className="saladict-dict-title-link"
        href="#"
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          // openDictSrcPage(dictID, dictLangs)
        }}
      >
        {title}
      </a>
      <span>
        {dictLangs.split('').map((c, i) =>
          (c
            ? (<span className="ml-1 px-0.5 text-sm text-neutral-500 border border-neutral-500 rounded-xs" key={langCodes[i]}>
              {t(`dict.lang.${langCodes[i]}`)}
            </span>)
            : null)
        )}
      </span>
      <div className="grow"></div>
      <div className="opt flex ">

      </div>
    </div>
  )
}

export const DictTitleMemo = React.memo(DictTitle)

function openDictSrcPage (dictID: DictID, dictLangs: string) {
  // const text = +dictLangs[0]
  //   ? 'salad'
  //   : +dictLangs[1] || +dictLangs[2]
  //     ? '沙拉'
  //     : +dictLangs[3]
  //       ? 'サラダ'
  //       : +dictLangs[4]
  //         ? '샐러드'
  //         : 'salad'
  // let text = '沙拉'
  // if (+dictLangs[0]) {
  //   text = 'salad'
  // } else if (+dictLangs[1] || +dictLangs[2]) {
  //   text = '沙拉'
  // } else if (+dictLangs[3]) {
  //   text = 'サラダ'
  // } else if (+dictLangs[4]) {
  //   text = '샐러드'
  // }
}
