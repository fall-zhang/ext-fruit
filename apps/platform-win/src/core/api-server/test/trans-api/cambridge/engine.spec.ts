/* eslint-disable max-nested-callbacks */
import { retry } from '../../utils'
import { search } from '@/core/api-server/api-common/cambridge/engine'
import { getDefaultConfig, AppConfigMutable } from '@/config/app-config'
import getDefaultProfile from '@/config/app-config/profiles'
import { afterAll, describe, expect, it } from 'vitest'

const fetchbak = window.fetch

describe('Dict/Cambridge/engine', () => {
  afterAll(() => {
    window.fetch = fetchbak
  })

  it('should parse result (en) correctly', () => {
    return retry(() =>
      search('love', getDefaultConfig(), getDefaultProfile()).then(({ result, audio }) => {
        expect(audio && typeof audio.uk).toBe('string')
        expect(audio && typeof audio.us).toBe('string')

        expect(result.length).toBeGreaterThanOrEqual(1)

        expect(result.every(x => typeof x === 'string')).toBeGreaterThanOrEqual(
          1
        )
      })
    )
  })

  it('should parse result (zhs) correctly', () => {
    return retry(() =>
      search('house', getDefaultConfig(), getDefaultProfile()).then(({ result, audio }) => {
        expect(audio && typeof audio.uk).toBe('string')
        expect(audio && typeof audio.us).toBe('string')

        expect(result.length).toBeGreaterThanOrEqual(1)

        expect(result.every(x => typeof x === 'string')).toBeGreaterThanOrEqual(
          1
        )
      })
    )
  })

  it('should parse result (zht) correctly', () => {
    const config = getDefaultConfig() as AppConfigMutable
    config.langCode = 'zh-TW'
    return retry(() =>
      search('catch', config, getDefaultProfile()).then(
        ({ result, audio }) => {
          expect(audio && typeof audio.uk).toBe('string')
          expect(audio && typeof audio.us).toBe('string')

          expect(result.length).toBeGreaterThanOrEqual(1)

          expect(
            result.every(x => typeof x === 'string')
          ).toBeGreaterThanOrEqual(1)
        }
      )
    )
  })
})
