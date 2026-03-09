import AxiosMockAdapter from 'axios-mock-adapter'

/**
 * For testing and storybook.
 *
 * Mock all the requests and returns all searchable texts.
 */
export interface MockRequest {
  (mock: AxiosMockAdapter): void
}


export const mockSearchTexts = ['沙拉', '爱']

export const mockRequest: MockRequest = mock => {
  mock.onGet(/zdic/).reply(info => {
    const wordMatch = /[^/]+$/.exec(info.url || '')
    return wordMatch
      ? [
        200,
        require(`./response/${decodeURIComponent(
          wordMatch[0]
        )}.html`).default
      ]
      : [404]
  })
}
