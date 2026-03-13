import type { FC } from 'react'
import EntryBox from '@/components/EntryBox'
import { StrElm } from '@/components/StrElm'
import type { WeblioResult } from '@/core/api-server/trans-api/weblio/engine'
import type { ViewProps } from '../type'

export const DictWeblio: FC<ViewProps<WeblioResult>> = ({ result }) => (
  <div className="dictWeblio-Container">
    {result.map(({ title, def }) => (
      <EntryBox
        key={title}
        className="dictWeblio-Entry"
        title={<StrElm tag="span" html={title} />}
      >
        <StrElm html={def} />
      </EntryBox>
    ))}
  </div>
)

export default DictWeblio
