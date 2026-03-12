import type { FC } from 'react'
import React from 'react'
import Speaker from '@/components/Speaker'
import { StrElm } from '@/components/StrElm'
import type { ShanbayResult } from '@/core/api-server/trans-api/shanbay/type'
import type { ViewProps } from '../type'

export const DictShanbay: FC<ViewProps<ShanbayResult>> = ({ result }) => (
  <>
    {result.title && (
      <div className="dictShanbay-HeaderContainer">
        <h1 className="dictShanbay-Title">{result.title}</h1>
        <span className="dictShanbay-Pattern">{result.pattern}</span>
      </div>
    )}
    {result.prons.length > 0 && (
      <div className="dictShanBay-HeaderContainer">
        {result.prons.map(({ phsym, url }) => (
          <React.Fragment key={url}>
            {phsym} <Speaker src={url} />
          </React.Fragment>
        ))}
      </div>
    )}
    {result.basic && (
      <StrElm className="dictShanbay-Basic" html={result.basic} />
    )}
    {result.sentences && (
      <div>
        <h1 className="dictShanbay-SecTitle">权威例句</h1>
        <ol className="dictShanbay-Sentence">
          {result.sentences.map(sentence => (
            <li key={sentence.annotation}>
              <StrElm tag="p" html={sentence.annotation} />
              <p>{sentence.translation}</p>
            </li>
          ))}
        </ol>
      </div>
    )}
  </>
)

export default DictShanbay
