import type { FC } from 'react'
import type { ZdicResult } from './engine'
import type { ViewProps } from '../helpers'
import EntryBox from '@P/saladict-core/src/components/EntryBox'
import { StrElm } from '@P/saladict-core/src/components/StrElm'

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
