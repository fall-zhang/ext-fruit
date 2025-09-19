import { useCallback, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
type HistoryOption = {
  maxStep?:number
}
/**
 * 历史记录功能
 */
export const useHistory = <T>(initValue:T, options?:HistoryOption) => {
  const [current, setCurrent] = useState<T>(initValue)
  const historyStack = useRef<T[]>([initValue])
  const undoStack = useRef<T[]>([])
  const undo = useCallback(() => {
    if (historyStack.current.length > 0) {
      const last = historyStack.current.pop()
      undoStack.current.push(last!)
      setCurrent(last!)
      return last
    }
    return undefined
  }, [])
  const redo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const last = undoStack.current.pop()
      setCurrent(last!)
      return last
    }
    return undefined
  }, [])

  const pushToHistory = useCallback((rec:T) => {
    historyStack.current.push(rec)
    setCurrent(rec)
    if (undoStack.current.length > 0) {
      undoStack.current = []
    }
  }, [])
  return {
    undo,
    redo,
    historyStack,
    current,
    pushToHistory
  }
}

/**
 * 历史操作功能，可以根据每一项操作进行针对撤回和重做
 */
export const useHistoryList = <T>(initValue:T[]) => {
  const [historyStack, setHistoryStack] = useImmer<T[]>(initValue)
  const undoStack = useRef<T[]>([])
  function undo () {
    setHistoryStack(draft => {
      if (draft.length > 0) {
        const last = draft.pop()
        return draft
      }
      return draft
    })
  }
  function redo () {
    if (undoStack.current.length > 0) {
      const last = undoStack.current.pop()
      return last
    }
    return undefined
  }

  function pushToHistory () {
    if (undoStack.current.length > 0) {
      undoStack.current = []
    }
  }
  return {
    undo,
    redo,
    historyStack,
    pushToHistory
  }
}


/**
 * 包装 useImmer，简化历史操作
 * @param initValue 初始值
 * @param options 配置
 * @returns
 */
export const useHistoryState = <T>(initValue:T, options?:HistoryOption) => {
  const [current, setCurrent] = useState<T>(initValue)
  const historyStack = useRef<T[]>([initValue])
  const undoStack = useRef<T[]>([])
  const undo = useCallback(() => {
    if (historyStack.current.length > 0) {
      const last = historyStack.current.pop()
      undoStack.current.push(last!)
      setCurrent(last!)
      return last
    }
    return undefined
  }, [])
  const redo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const last = undoStack.current.pop()
      setCurrent(last!)
      return last
    }
    return undefined
  }, [])

  const pushToHistory = useCallback((rec:T) => {
    historyStack.current.push(rec)
    setCurrent(rec)
    if (undoStack.current.length > 0) {
      undoStack.current = []
    }
  }, [])
  /**
   * 只更新 state，不添加到历史列表中
   * @param rec
   */
  const onlyUpdateState = (rec:T) => {
    setCurrent(rec)
  }
  return {
    undo,
    redo,
    historyStack,
    current,
    pushToHistory
  }
}
