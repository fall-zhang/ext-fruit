import { retry } from '../helpers'
import { search } from '@P/trans-api/src/eudic/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Eudic/engine', () => {
  it('should parse result correctly', async () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile(), {
        isPDF: false
      }).then(searchResult => {
        expect(searchResult.audio && typeof searchResult.audio.us).toBe(
          'string'
        )
        expect(searchResult.result).toHaveLength(10)
        const item = searchResult.result[0]
        expect(typeof item.chs).toBe('string')
        expect(typeof item.eng).toBe('string')
        expect(typeof item.mp3).toBe('string')
        expect(typeof item.channel).toBe('string')
      })
    )
  })
})
