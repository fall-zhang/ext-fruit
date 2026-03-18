import { describe, it, expect } from 'vitest'
import { getChsToChz } from '../src/utils/chs-to-chz'
describe('Chs to Chz', () => {
  it('should convert chs to chz', () => {
    expect(getChsToChz('龙龟')).toBe('龍龜')
  })
})
