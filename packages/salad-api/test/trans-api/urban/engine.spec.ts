import { retry } from '../../utils'
import { search } from '@/core/api-server/trans-api/urban/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, it, expect } from 'vitest'

describe('Dict/Urban/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(searchResult => {
        expect(searchResult.audio && typeof searchResult.audio.us).toBe(
          'string'
        )
        expect(searchResult.result.length).toBeGreaterThan(0)
        const item = searchResult.result[0]
        expect(typeof item.title).toBe('string')
        expect(typeof item.pron).toBe('string')
        expect(typeof item.meaning).toBe('string')
        expect(typeof item.example).toBe('string')
        expect(typeof item.contributor).toBe('string')
        expect(typeof item.thumbsUp).toBe('string')
        expect(typeof item.thumbsDown).toBe('string')
      })
    )
  })
})
