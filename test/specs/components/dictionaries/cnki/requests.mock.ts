import { MockRequest } from '@P/trans-api/src/helpers'

export const mockSearchTexts = ['love']

export const mockRequest: MockRequest = mock => {
  mock.onGet(/cnki/).reply(info => {
    return [
      200,
      require('!raw-loader!./response/' +
        new URL(info.url!).searchParams.get('searchword') +
        '.html').default
    ]
  })
}
