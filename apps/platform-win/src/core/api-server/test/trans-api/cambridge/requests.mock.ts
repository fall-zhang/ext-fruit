import { MockRequest } from '@/components/Dictionaries/helpers'

export const mockSearchTexts = ['jumblish', 'catch-zht', 'house-zhs', 'love']

export const mockRequest: MockRequest = mock => {
  // mock.onGet(/cambridge/).reply(info => {
  //   return [
  //     200,
  //     require('!raw-loader!./response/' +
  //       new URL(info.url!).searchParams.get('q') +
  //       '.html').default
  //   ]
  // })
}
