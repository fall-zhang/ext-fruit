export type HTMLString = string

export interface AtomSearchResult<Result = unknown> {
  /** search result */
  result: Result
  /** auto play sound */
  audio?: {
    uk?: string
    us?: string
    py?: string
  }
}
