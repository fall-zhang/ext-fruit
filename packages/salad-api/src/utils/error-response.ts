export function handleNoResult<T = any> (): Promise<T> {
  return Promise.reject(new Error('NO_RESULT'))
}

export function handleNetWorkError (err: any): Promise<never> {
  return Promise.reject(new Error('NETWORK_ERROR'))
}
