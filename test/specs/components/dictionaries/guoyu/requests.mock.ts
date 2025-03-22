import { MockRequest } from '@P/trans-api/src/helpers'

export const mockSearchTexts = ['愛']

export const mockRequest: MockRequest = mock => {
  mock.onGet(/moedict/).reply(200, require('./response/愛.json'))
}
