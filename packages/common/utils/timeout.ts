// 定时相关的方法
type ReceiveFun = {
  (...arg: unknown[]): void
}
type WithdrawFun = {
  (): void
}
/**
 * 用法同 setTimeout 但是返回可以清空的
 * @param fun 调用的内容
 * @param time 时间
 * @returns 可以清空定时的函数
 */
export const onTimeout = (fun: ReceiveFun, time = 200):WithdrawFun => {
  const timber: number = window.setTimeout(() => {
    fun()
  }, time)
  return () => {
    clearTimeout(timber)
  }
}

/**
 * 可以控制开始和结束的 timeout
 * @param fun
 * @param time
 * @returns
 */
export const ownTimeout = (fun: ReceiveFun, time = 300) => {
  let timber: number = 0
  return {
    start () {
      timber = window.setTimeout(() => {
        timber = 0
        fun()
      }, time)
    },
    clear () {
      clearTimeout(timber)
      timber = 0
    }
  }
}

