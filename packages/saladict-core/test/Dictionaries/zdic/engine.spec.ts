import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/zdic/engine'
import { getDefaultConfig } from '@/app-config'
import getDefaultProfile, { ProfileMutable } from '@/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Zdic/engine', () => {
  it('should parse word result correctly', () => {
    return retry(() =>
      search('爱', getDefaultConfig(), getDefaultProfile()).then(({ result, audio }) => {
        expect(audio && typeof audio.py).toBeUndefined()
        expect(result.length).toBeGreaterThan(0)
      })
    )
  })

  it('should parse phrase result correctly', () => {
    const profile = getDefaultProfile() as ProfileMutable
    profile.dicts.all.zdic.options.audio = true
    return retry(() =>
      search('沙拉', getDefaultConfig(), profile).then(
        ({ result, audio }) => {
          expect(audio && typeof audio.py).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        }
      )
    )
  })
})
