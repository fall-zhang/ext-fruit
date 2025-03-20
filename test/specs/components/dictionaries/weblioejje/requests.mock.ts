import { MockRequest } from '@/components/dictionaries/helpers'

export const mockSearchTexts = ['love', '愛']

export const mockRequest: MockRequest = mock => {
  mock
    .onGet(/ejje\.weblio\.jp.+love/)
    .reply(200, require('./response/love.html').default)

  mock
    .onGet(new RegExp('ejje\\.weblio\\.jp.+' + encodeURIComponent('愛')))
    .reply(200, require('./response/愛.html').default)
}
