/* eslint-disable max-nested-callbacks */
import { retry } from '../../utils'
import { search } from '@/core/api-server/api-common/weblioejje/engine'
import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/app-config/profiles'
import { describe, expect, it } from 'vitest'

describe('Dict/Weblioejje/engine', () => {
  ;['love', '愛'].forEach(text => {
    it(`should parse result ${text} correctly`, () => {
      return retry(() =>
        search(text, getDefaultConfig(), getDefaultProfile()).then(({ result }) => {
          expect(result.length).toBeGreaterThanOrEqual(1)
          for (const { content } of result) {
            expect(typeof content).toBe('string')
            expect(content.length).toBeGreaterThan(1)
          }
        })
      )
    })
  })
})
