import React, { FC } from 'react'
import { ZdicResult } from './engine'
import { ViewProps } from '@/components/dictionaries/helpers'
import EntryBox from '@/components/EntryBox'
import { StrElm } from '@/components/StrElm'

export const DictZdic: FC<ViewProps<ZdicResult>> = ({ result }) => (
  <div>
    {result.map(entry => (
      <EntryBox title={entry.title} key={entry.title}>
        <StrElm html={entry.content} />
      </EntryBox>
    ))}
  </div>
)

export default DictZdic
