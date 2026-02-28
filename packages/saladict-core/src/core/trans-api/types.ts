
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { Word } from '@P/saladict-core/src/types/word'
import type { DictID, AppConfig } from '../../app-config'
import type { AllDicts } from '../../app-config/dicts'
/** Fetch and parse dictionary search result */
export interface SearchFunction<Result, Payload = unknown> {
  (
    text: string,
    options:{
      config: AppConfig,
      profile: AllDicts,
      payload: Readonly<Payload>
    }
  ): Promise<DictSearchResult<Result>>
}

export interface DictSearchResult<Result> {
  /** search result */
  result: Result
  /** auto play sound */
  audio?: {
    uk?: string
    us?: string
    py?: string
  }
  /** generate menus on dict titlebars */
  catalog?: Array<
    | {
      // <button>
      key: string
      value: string
      label: string
      options?: undefined
    } |
    {
      // <select>
      key: string
      value: string
      options: Array<{
        value: string
        label: string
      }>
      title?: string
    }
  >
}

/** Return a dictionary source page url for the dictionary header */
export interface GetSrcPageFunction {
  (text: string, config: AppConfig, profile: AllDicts): string | Promise<string>
}

/**
 * For testing and storybook.
 *
 * Mock all the requests and returns all searchable texts.
 */
export interface MockRequest {
  (mock: AxiosMockAdapter): void
}

export type HTMLString = string

export interface ViewProps<T> {
  result: T
  searchText: <P = { [index: string]: any }>(arg?: {
    id?: DictID
    word?: Word
    payload?: P
  }) => any
}

export type SearchErrorType = 'NO_RESULT' | 'NETWORK_ERROR'
