import React, { FC } from 'react'
import { VocabularyResult } from './engine'
import { ViewPorps } from '@P/trans-api/src/helpers'

export const DictVocabulary: FC<ViewPorps<VocabularyResult>> = ({ result }) => (
  <>
    <p className="dictVocabulary-Short">{result.short}</p>
    <p className="dictVocabulary-Long">{result.long}</p>
  </>
)

export default DictVocabulary
