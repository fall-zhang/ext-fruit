import { retry } from '../helpers'
import { search } from '@P/trans-api/src/jikipedia/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { describe, it, expect } from 'vitest'
describe('Dict/Jikipedia/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('xswl', getDefaultConfig(), getDefaultProfile(), {
        isPDF: false
      }).then(searchResult => {
        expect(typeof searchResult.result.length).toBeGreaterThan(0)
        expect(searchResult.result[0].title).toBe('string')
        expect(searchResult.result[0].content).toBe('string')
      })
    )
  })
})
