import type AxiosMockAdapter from 'axios-mock-adapter'

/**
 * For testing and storybook.
 *
 * Mock all the requests and returns all searchable texts.
 */
export interface MockRequest {
  (mock: AxiosMockAdapter): void
}
