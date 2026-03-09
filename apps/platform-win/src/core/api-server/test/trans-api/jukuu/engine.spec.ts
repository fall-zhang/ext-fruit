import { retry } from '../helpers'
import { search } from '@/core/api-server/api-common/jukuu/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Jukuu/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(searchResult => {
        expect(typeof searchResult.result.lang).toBe('string')
        expect(searchResult.result.sens.length).toBeGreaterThan(0)
        expect(typeof searchResult.result.sens[0].trans).toBe('string')
        expect(searchResult.result.sens[0].trans.length).toBeGreaterThan(0)
      })
    )
  })
})
