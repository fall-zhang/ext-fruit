import { MockRequest } from '@/components/Dictionaries/helpers'

export const mockSearchTexts = ['沙拉', '爱']

export const mockRequest: MockRequest = mock => {
  mock.onGet(/zdic/).reply(info => {
    // const wordMatch = /[^/]+$/.exec(info.url || '')
    // return wordMatch
    //   ? [
    //     200,
    //     require(`raw-loader!./response/${decodeURIComponent(
    //       wordMatch[0]
    //     )}.html`).default
    //   ]
    //   : [404]
  })
}
