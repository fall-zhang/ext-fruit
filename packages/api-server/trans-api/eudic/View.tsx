import React, { FC } from 'react'
import { EudicResult } from './engine'
import Speaker from '@/components/Speaker'
import { ViewProps } from '@/components/dictionaries/helpers'

export const DictEudic: FC<ViewProps<EudicResult>> = ({ result }) => (
  <ul className="dictEudic-List">
    {result.map(item => (
      <li key={item.chs} className="dictEudic-Item">
        <p>
          {item.eng} <Speaker src={item.mp3} />
        </p>
        <p>{item.chs}</p>
        <footer>
          {item.channel && <p className="dictEudic-Channel">{item.channel}</p>}
        </footer>
      </li>
    ))}
  </ul>
)

export default DictEudic
