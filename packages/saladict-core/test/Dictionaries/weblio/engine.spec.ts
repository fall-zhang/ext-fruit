/* eslint-disable max-nested-callbacks */
import { retry } from '../helpers'
import { search } from '@/components/Dictionaries/weblio/engine'
import { getDefaultConfig } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
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
