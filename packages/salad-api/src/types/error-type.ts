export type TranslateErrorType = |
  'NETWORK_ERROR' |
  'NETWORK_TIMEOUT' |
  'API_SERVER_ERROR' |
  'UNSUPPORTED_LANG' |
  'USAGE_LIMIT' |
  'AUTH_ERROR' |
  'UNKNOWN' |
  'TOO_MANY_REQUESTS'

export class TranslateError extends Error {
  constructor (message: TranslateErrorType, cause?: string) {
    super(message, { cause })
  }
}
