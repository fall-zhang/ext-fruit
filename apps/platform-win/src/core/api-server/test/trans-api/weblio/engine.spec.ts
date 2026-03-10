/* eslint-disable max-nested-callbacks */
import { retry } from '../../utils'
import { search } from '@/core/api-server/api-common/weblio/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, it, expect } from 'vitest'

describe('Dict/Weblio/engine', () => {
  ['love', '吐く', '当たる'].forEach(text => {
    it(`should parse result ${text} correctly`, () => {
      return retry(() =>
        search(text, getDefaultConfig(), getDefaultProfile()).then(({ result }) => {
          expect(result.length).toBeGreaterThanOrEqual(1)
          expect(typeof result[0].title).toBe('string')
          expect(typeof result[0].def).toBe('string')
        })
      )
    })
  })
})
