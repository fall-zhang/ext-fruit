import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/cobuild/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile, ProfileMutable } from '@/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/COBUILD/engine', () => {
  it('should parse result correctly', () => {
    const profile = getDefaultProfile() as ProfileMutable
    return retry(() =>
      search('love', getDefaultConfig(), profile).then(
        searchResult => {
          expect(searchResult.result).toBeTruthy()
        }
      )
    )
  })
})
