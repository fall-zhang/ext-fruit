import { retry } from '../helpers'
import { search } from '@/core/api-server/api-common/renren/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, it } from 'vitest'

describe('Dict/Renren/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(searchResult => {})
    )
  })
})
