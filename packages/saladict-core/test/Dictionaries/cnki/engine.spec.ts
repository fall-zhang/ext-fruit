import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/cnki/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { describe, it, expect } from 'vitest'

describe('Dict/CNKI/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile(), {
        isPDF: false
      }).then(({ result, audio }) => {
        expect(audio).toBeUndefined()
        expect(result.dict.length).toBeGreaterThan(0)
        expect(result.senbi.length).toBeGreaterThan(0)
        expect(result.seneng.length).toBeGreaterThan(0)
      })
    )
  })
})
