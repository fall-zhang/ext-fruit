import React, { FC } from 'react'
import { EtymonlineResult } from './engine'
import { ViewPorps } from '@P/trans-api/src/helpers'
import { StrElm } from '@/components/StrElm'

export const DictEtymonline: FC<ViewPorps<EtymonlineResult>> = ({ result }) => (
  <ul className="dictEtymonline-List">
    {result.map(item => (
      <li key={item.title} className="dictEtymonline-Item">
        <h2 id={item.id} className="dictEtymonline-Title">
          {item.href
            ? (
              <a
                href={item.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {item.title}
              </a>
            )
            : (
              item.title
            )}
        </h2>
        <StrElm tag="p" className="dictEtymonline-Def" html={item.def} />
        {item.chart
          ? (
            <img src={item.chart} alt={'Origin of ' + item.title} />
          )
          : null}
      </li>
    ))}
  </ul>
)

export default DictEtymonline
