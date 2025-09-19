import { useCallback, useRef } from 'react'

type AnyArgFunction = {
  (...args: any[]): void
}
/**
 * 防抖，钩子
 * @param fun 传入方法
 * @param delay 防抖延迟
 * @returns 返回触发器以及取消执行传入的 fun
 */
export const useDebounce = (fun: AnyArgFunction, delay: number = 300) => {
  const timber = useRef<number>(-1)

  const trigger = useCallback((...rec:unknown[]) => {
    if (timber.current) {
      clearTimeout(timber.current)
    }
    timber.current = window.setTimeout(() => {
      timber.current = 0
      fun(...rec)
    }, delay)
  }, [delay, fun])
  const clear = useCallback(() => {
    if (timber.current) {
      clearTimeout(timber.current)
    }
  }, [])
  // return trigger
  return {
    trigger,
    clear
  }
}
export const useThrottle = (fun: AnyArgFunction, delay: number = 300) => {
  const timber = useRef<number>(-1)

  const trigger = useCallback((...rec:unknown[]) => {
    if (timber.current) {
      return
    }
    timber.current = window.setTimeout(() => {
      timber.current = 0
      fun(...rec)
    }, delay)
  }, [delay, fun])

  const clear = useCallback(() => {
    if (timber.current) {
      clearTimeout(timber.current)
    }
  }, [])
  return {
    trigger,
    clear
  }
}
