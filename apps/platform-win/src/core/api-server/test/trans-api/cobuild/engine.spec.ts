import { retry } from '../../utils'
import { search } from '@/core/api-server/api-common/cobuild/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile, ProfileMutable } from '@/config/app-config/profiles'
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
