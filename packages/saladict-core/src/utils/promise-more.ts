/**
 * Like setTimeout but returns Promise.
 */
export function timer (delay?: number): Promise<string>
export function timer<T = string> (delay: number, payload?: T): Promise<T>
export function timer (time?:number, ...args:any[]) {
  return new Promise<string>(resolve => {
    setTimeout(
      () => (args.length > 1 ? resolve(args[1]) : resolve('done')),
      Number(time) || 0, args
    )
  })
}

/**
 * Timeouts a promise.
 * Rejects when timeout.
 */
export function timeout<T> (pr: PromiseLike<T>, delay = 0): Promise<T> {
  return Promise.race([
    pr,
    timer(delay).then(() => Promise.reject(new Error(`timeout ${delay}ms`)))
  ])
}

export default {
  timer,
  timeout
}
