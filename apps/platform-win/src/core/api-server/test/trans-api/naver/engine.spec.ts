import { retry } from '../../utils'
import { search } from '@/core/api-server/trans-api/naver/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile, ProfileMutable } from '@/config/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Naver/engine', () => {
  it('should search zh dict', () => {
    return retry(() =>
      search('爱', getDefaultConfig(), getDefaultProfile()).then(searchResult => {
        expect(searchResult.result.lang).toBe('zh')
        expect(typeof searchResult.result.entry).toBe('object')
      })
    )
  })

  it('should search ja dict', () => {
    const profile = getDefaultProfile() as ProfileMutable
    profile.dicts.all.naver.options.hanAsJa = true
    return retry(() =>
      search('愛', getDefaultConfig(), profile).then(
        searchResult => {
          expect(searchResult.result.lang).toBe('ja')
          expect(typeof searchResult.result.entry).toBe('object')
        }
      )
    )
  })
})
