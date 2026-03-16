import { retry } from '../../utils'
import { search } from '@/core/api-server/trans-api/guoyu/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/GuoYu/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('愛', getDefaultConfig(), getDefaultProfile()).then(searchResult => {
        expect(searchResult.audio && typeof searchResult.audio.py).toBe(
          'string'
        )
        expect(typeof searchResult.result.t).toBe('string')
        expect(Array.isArray(searchResult.result.h)).toBeTruthy()
        expect(searchResult.result.translation).toBeTruthy()
      })
    )
  })
})
