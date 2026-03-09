import { it } from 'date-fns/locale'

describe('Chs to Chz', () => {
  it('should convert chs to chz', () => {
    expect(chsToChz('龙龟')).toBe('龍龜')
  })
})
