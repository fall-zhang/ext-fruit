import { retry } from '../helpers'
import { search } from '@/core/api-server/api-common/wikipedia/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Wikipedia/engine', () => {
  it('should parse result correctly', () => {
    return retry(() =>
      search('数字', getDefaultConfig(), getDefaultProfile()).then(({ result }) => {
        expect(typeof result.title).toBe('string')
        expect(typeof result.content).toBe('string')
      })
    )
  })
})
