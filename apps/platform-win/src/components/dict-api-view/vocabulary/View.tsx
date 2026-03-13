import type { VocabularyResult } from '@/core/api-server/trans-api/vocabulary/engine'
import type { FC } from 'react'
import type { ViewProps } from '../type'

export const DictVocabulary: FC<ViewProps<VocabularyResult>> = ({ result }) => (
  <>
    <p className="dictVocabulary-Short">{result.short}</p>
    <p className="dictVocabulary-Long">{result.long}</p>
  </>
)

export default DictVocabulary
