import { MockRequest } from '@P/trans-api/src/helpers'

export const mockSearchTexts = ['xswl']

export const mockRequest: MockRequest = mock => {
  mock
    .onGet(/jikipedia/)
    .reply(200, require('raw-loader!./response/xswl.html').default)
}
