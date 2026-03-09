import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/renren/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { describe, it } from 'vitest'

describe('Dict/Renren/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(searchResult => {})
    )
  })
})
