import { retry } from '../helpers'
import { search } from '@/core/api-server/api-common/cnki/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, it, expect } from 'vitest'

describe('Dict/CNKI/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(({ result, audio }) => {
        expect(audio).toBeUndefined()
        expect(result.dict.length).toBeGreaterThan(0)
        expect(result.senbi.length).toBeGreaterThan(0)
        expect(result.seneng.length).toBeGreaterThan(0)
      })
    )
  })
})
