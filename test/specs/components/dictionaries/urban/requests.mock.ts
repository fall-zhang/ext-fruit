import { MockRequest } from '@P/trans-api/src/helpers'

export const mockSearchTexts = ['love']

export const mockRequest: MockRequest = mock => {
  mock
    .onGet(/urbandictionary/)
    .reply(200, require('raw-loader!./response/love.html').default)
}
