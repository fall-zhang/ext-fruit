import { retry } from '../../utils'
import { search } from '@/core/api-server/trans-api/vocabulary/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, it, expect } from 'vitest'
describe('Dict/Vocabulary/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(({ result, audio }) => {
        expect(audio).toBeUndefined()
        expect(typeof result.long).toBe('string')
        expect(typeof result.short).toBe('string')
      })
    )
  })
})
