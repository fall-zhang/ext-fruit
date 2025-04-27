import { retry } from '../helpers'
import { search } from '@P/trans-api/src/guoyu/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/GuoYu/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('愛', getDefaultConfig(), getDefaultProfile(), {
        isPDF: false
      }).then(searchResult => {
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
