import type { FC } from 'react'
import type { ZdicResult } from './engine'
import type { ViewProps } from '../../utils'
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
