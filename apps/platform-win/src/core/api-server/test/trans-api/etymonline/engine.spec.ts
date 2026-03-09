import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/etymonline/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile, ProfileMutable } from '@/app-config/profiles'
import { describe, it, expect } from 'vitest'
describe('Dict/Etymonline/engine', () => {
  it('should parse result correctly', () => {
    const profile = getDefaultProfile() as ProfileMutable
    profile.dicts.all.etymonline.options = {
      chart: true,
      resultCount: 4
    }
    return retry(() =>
      search('love', getDefaultConfig(), profile).then(
        (searchResult:any) => {
          expect(searchResult.audio).toBeUndefined()

          const result = searchResult.result
          expect(result.length).toBeGreaterThanOrEqual(1)
          expect(typeof result[0].title).toBe('string')
          expect(typeof result[0].href).toBe('string')
          expect(typeof result[0].def).toBe('string')
        }
      )
    )
  })
})
