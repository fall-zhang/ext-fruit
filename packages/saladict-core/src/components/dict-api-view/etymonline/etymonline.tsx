import type { FC } from 'react'
import type { EtymonlineResult } from '@P/api-server/trans-api/etymonline/engine'
import type { ViewProps } from '../type'
import { StrElm } from '../../StrElm'

export const DictEtymonline: FC<ViewProps<EtymonlineResult>> = ({ result }) => (
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
        <StrElm tag="div" className="dictEtymonline-Def" html={item.def} />
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
