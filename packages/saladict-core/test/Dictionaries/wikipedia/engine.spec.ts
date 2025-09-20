import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/wikipedia/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
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
