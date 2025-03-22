import { MockRequest } from '@P/trans-api/src/helpers'

export const mockSearchTexts = ['love']

export const mockRequest: MockRequest = mock => {
  mock.onAny(/eudic/).reply(info => {
    const file = /tab-detail/.test(info.url || '') ? 'sentences' : 'love'
    return [200, require(`raw-loader!./response/${file}.html`).default]
  })
}
