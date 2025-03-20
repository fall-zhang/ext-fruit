import { MockRequest } from '@/components/dictionaries/helpers'

export const mockSearchTexts = ['make', 'love', 'translation', 'jumblish']

export const mockRequest: MockRequest = mock => {
  mock.onGet(/youdao/).reply(info => {
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
