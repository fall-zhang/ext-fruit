import type { FC } from 'react'
import React from 'react'
import EntryBox from '@/components/EntryBox'
import { StrElm } from '@/components/StrElm'
import type { WeblioejjeResult } from '@/core/api-server/trans-api/weblioejje/engine'
import type { ViewProps } from '../type'

export const DictWeblioejje: FC<ViewProps<WeblioejjeResult>> = ({ result }) => (
  <div>
    {result.map((entry, i) =>
      (entry.title
        ? (
          <EntryBox key={entry.title + i} title={entry.title}>
            <StrElm html={entry.content} />
          </EntryBox>
        )
        : (
          <StrElm key={i} className="dictWeblioejje-Box" html={entry.content} />
        ))
    )}
  </div>
)

export default DictWeblioejje
