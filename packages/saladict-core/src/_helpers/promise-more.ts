
/**
 * Like setTimeout but returns Promise.
 */
export function timer (delay?: number): Promise<void>
export function timer<T = any> (delay: number, payload?: T): Promise<T>
export function timer (...args) {
  return new Promise<any>(resolve => {
    setTimeout(
      () => (args.length > 1 ? resolve(args[1]) : resolve()),
      Number(args[0]) || 0
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
    timer(delay).then(() => {
      throw new Error(`timeout ${delay}ms`)
    })
  ])
}

export default {
  timer,
  timeout
}
