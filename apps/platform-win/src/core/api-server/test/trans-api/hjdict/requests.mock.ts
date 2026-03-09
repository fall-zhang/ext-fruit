import { MockRequest } from '@/core/api-server/api-common/helpers'

export const mockSearchTexts = ['爱', 'love', 'henr']

export const mockRequest: MockRequest = mock => {
  // mock.onGet(/hjdict/).reply(info => {
  //   const wordMatch = /[^/]+$/.exec(info.url || '')
  //   return wordMatch
  //     ? [
  //       200,
  //       require(`raw-loader!./response/${decodeURIComponent(
  //         wordMatch[0]
  //       )}.html`).default
  //     ]
  //     : [404]
  // })
}
