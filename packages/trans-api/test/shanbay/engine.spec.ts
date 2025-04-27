import { retry } from '../helpers'
import { search } from '@P/trans-api/src/shanbay/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { isContainChinese } from '@/_helpers/lang-check'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Dict/Shanbay/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('hello', getDefaultConfig(), getDefaultProfile(), {
        isPDF: false
      }).then(searchResult => {
        expect(searchResult.result.title).toBe('hello')
        expect(typeof (searchResult.audio || {}).us).toBe('string')
        expect(searchResult.result.id).toBe('shanbay')
        expect(isContainChinese(searchResult.result.basic || '')).toBeTruthy()
        expect(searchResult.result.sentences.length).toBeGreaterThanOrEqual(1)
        expect(searchResult.result.prons.length).toBeGreaterThanOrEqual(1)
        expect(searchResult.result.prons[0].url).toEqual(
          (searchResult.audio || {}).us
        )
      })
    )
  })
})
