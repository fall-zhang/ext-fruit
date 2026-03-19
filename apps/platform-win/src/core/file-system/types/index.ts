export type OperateResult<T = any> = {
  state: 'failure',
  msg: string,
} | {
  state: 'success',
  msg: string,
  data: T
}

export type PromiseOptResult<T = any> = Promise<OperateResult<T>>
