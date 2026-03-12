import type { FC } from 'react'
import EntryBox from '@/components/EntryBox'
import { StrElm } from '@/components/StrElm'
import type { ZdicResult } from '@/core/api-server/trans-api/zdic/engine'
import type { ViewProps } from '../type'

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
