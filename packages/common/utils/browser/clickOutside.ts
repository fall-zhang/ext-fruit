/**
 * 点击其他区域的时候触发
 * @param element 文档
 * @param event
 */
interface AnyFun {
  (...arg: any[]): void
}

interface ExecuteFun {
  (): void
}
interface OutSideEvent {
  (fun: AnyFun, element?: Element): Record<'cancel' | 'trigger', ExecuteFun> | void
}


export const clickOutside = (event: AnyFun, element: any) => {
  // console.log('🚀 ~ event:', event, element)
  const fun = event
  document.addEventListener('click', fun)
  return {
    cancel () {
      document.removeEventListener('click', fun)
    },
    trigger () {
      event()
    },
  }
}

/**
 * 点击外部的时候，自动执行一次事件
 * @param event 执行的事件
 * @param element
 * @returns
 */
export const clickOutsideOnce: OutSideEvent = (event, element) => {
  // console.log('🚀 ~ event:', event, element)
  // const fun = event
  const newEvent = () => {
    event()
    document.removeEventListener('click', newEvent)
  }

  document.addEventListener('click', newEvent)
  // 取消执行
  const cancel = () => {
    document.removeEventListener('click', newEvent)
  }
  // 手动触发
  const trigger = () => {
    newEvent()
  }
  return {
    cancel,
    trigger,
  }
}
