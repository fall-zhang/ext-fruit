import type { FC } from 'react'
import React, { useState } from 'react'
import { Speaker } from '@/components/Speaker'
import StarRates from '@/components/StarRates'
import { StrElm } from '@/components/StrElm'
import type { COBUILDResult, COBUILDCibaResult, COBUILDColResult } from '@/core/api-server/trans-api/cobuild/engine'
import type { ViewProps } from '../type'

export const DictCOBUILD: FC<ViewProps<COBUILDResult>> = ({ result }) => {
  switch (result.type) {
    case 'ciba':
      return renderCiba(result)
    case 'collins':
      return <RenderCol {...result}></RenderCol>
  }
  return null
}

export default DictCOBUILD

function renderCiba (result: COBUILDCibaResult) {
  return (
    <>
      <h1 className="dictCOBUILD-Title">{result.title}</h1>
      {result.prons && (
        <ul className="dictCOBUILD-Pron">
          {result.prons.map(p => (
            <li key={p.phsym} className="dictCOBUILD-PronItem">
              {p.phsym}
              <Speaker src={p.audio} />
            </li>
          ))}
        </ul>
      )}
      <div className="dictCOBUILD-Rate">
        {(result.star as number) >= 0 && <StarRates rate={result.star} />}
        {result.level && (
          <span className="dictCOBUILD-Level">{result.level}</span>
        )}
      </div>
      {result.defs && (
        <ol className="dictCOBUILD-Defs">
          {result.defs.map((def, i) => (
            <StrElm tag="li" className="dictCOBUILD-Def" key={i} html={def} />
          ))}
        </ol>
      )}
    </>
  )
}

function RenderCol (result: COBUILDColResult) {
  const [iSec, setiSec] = useState(0)
  const curSection = result.sections[iSec]

  return (
    <div className="dictCOBUILD-ColEntry">
      {result.sections.length > 0 && (
        <select value={iSec} onChange={e => setiSec(parseInt(e.currentTarget.value))}>
          {result.sections.map((section, i) => {
            return (
              <option key={section.id + i} value={i}>
                {section.type}
                {section.title ? ` :${section.title}` : ''}
                {section.num ? ` ${section.num}` : ''}
              </option>
            )
          })}
        </select>
      )}
      <div className="dictionary">
        <div className="dc">
          <div className="he">
            <div className="page">
              <div className="dictionary">
                <div className="dictentry">
                  <div className="dictlink">
                    <StrElm
                      className={curSection.className}
                      html={curSection.content}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
