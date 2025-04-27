import { retry } from '../helpers'
import { search } from '@P/trans-api/src/jukuu/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Jukuu/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile(), {
        isPDF: false
      }).then(searchResult => {
        expect(typeof searchResult.result.lang).toBe('string')
        expect(searchResult.result.sens.length).toBeGreaterThan(0)
        expect(typeof searchResult.result.sens[0].trans).toBe('string')
        expect(searchResult.result.sens[0].trans.length).toBeGreaterThan(0)
      })
    )
  })
})
