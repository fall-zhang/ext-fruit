import { useEffect, useState, useCallback } from 'react'
import { listenFromWindow, sendToWindow, broadcastToAllWindows } from '@/core/bridge'

/**
 * 窗口间通信的 React Hook
 * @example
 * // 在搜索窗口中监听来自配置窗口的消息
 * const { lastMessage, sendMessage } = useWindowCommunication('search-view', 'search-term-changed')
 */
export function useWindowCommunication<T = any> (
  windowLabel: string,
  eventName: string
) {
  const [lastMessage, setLastMessage] = useState<T | null>(null)
  const [isListening, setIsListening] = useState(false)

  // 监听事件
  useEffect(() => {
    let unlisten: (() => void) | null = null

    const setupListener = async () => {
      try {
        unlisten = await listenFromWindow<T>(eventName, (payload) => {
          console.log(`窗口 ${windowLabel} 收到事件 ${eventName}:`, payload)
          setLastMessage(payload)
        })
        setIsListening(true)
      } catch (error) {
        console.error('设置监听器失败:', error)
        setIsListening(false)
      }
    }

    setupListener()

    // 清理监听器
    return () => {
      if (unlisten) {
        unlisten()
        setIsListening(false)
      }
    }
  }, [windowLabel, eventName])

  // 向指定窗口发送消息
  const sendToTarget = useCallback(
    async <T>(targetWindow: 'config-view' | 'search-view', event: string, payload?: T) => {
      try {
        await sendToWindow(targetWindow, event, payload)
      } catch (error) {
        console.error('发送消息失败:', error)
        throw error
      }
    },
    []
  )

  // 向所有窗口广播消息
  const broadcast = useCallback(async <T>(event: string, payload?: T) => {
    try {
      await broadcastToAllWindows(event, payload)
    } catch (error) {
      console.error('广播消息失败:', error)
      throw error
    }
  }, [])

  return {
    lastMessage,
    isListening,
    sendToTarget,
    broadcast,
  }
}
