import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/vocabulary/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
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
