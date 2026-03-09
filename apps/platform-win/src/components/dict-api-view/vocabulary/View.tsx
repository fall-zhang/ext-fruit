import React, { FC } from 'react'
import { VocabularyResult } from './engine'
import { ViewProps } from '@/components/dictionaries/helpers'

export const DictVocabulary: FC<ViewProps<VocabularyResult>> = ({ result }) => (
  <>
    <p className="dictVocabulary-Short">{result.short}</p>
    <p className="dictVocabulary-Long">{result.long}</p>
  </>
)

export default DictVocabulary
