
type AnyArgFunction = {
  (...args: any[]): void
}
/**
 * 防抖
 */
export const debounce = (fn: AnyArgFunction, delay = 300) => {
  let timer: number | null = null
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
/**
 * 节流
 */
export const throttle = (fn: AnyArgFunction, delay = 300) => {
  let timer: number | null = null
  return (...args: any[]) => {
    if (timer) {
      return
    }
    timer = window.setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}
