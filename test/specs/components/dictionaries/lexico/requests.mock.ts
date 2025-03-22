import { MockRequest } from '@P/trans-api/src/helpers'

export const mockSearchTexts = ['how', 'love', 'jumblish']

export const mockRequest: MockRequest = mock => {
  mock.onGet(/lexico/).reply(info => {
    const wordMatch = /[^/]+$/.exec(info.url || '')
    return wordMatch
      ? [
        200,
        require(`raw-loader!./response/${decodeURIComponent(
          wordMatch[0]
        )}.html`).default
      ]
      : [404]
  })
}
