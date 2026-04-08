// 不同 window 的事件交互
// 该文件用作 tauri 和 js 进行通信，调用 rust 的方法
// tauri 提供的 fs API 无法访问文件系统的任意路径
import { emit, listen } from '@tauri-apps/api/event'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

/**
 * 向指定窗口发送事件
 * @param targetWindowLabel 目标窗口的 label
 * @param event 事件名称
 * @param payload 事件数据
 */
export async function sendToWindow<T = unknown> (
  targetWindowLabel: 'config-view' | 'search-view',
  event: string,
  payload?: T
): Promise<void> {
  try {
    // 获取目标窗口
    const targetWindow = await WebviewWindow.getByLabel(targetWindowLabel)
    if (!targetWindow) {
      console.warn(`目标窗口不存在: ${targetWindowLabel}`)
      return
    }

    // 向目标窗口发送事件
    await targetWindow.emit(event, payload)
    console.log(`已向窗口 ${targetWindowLabel} 发送事件: ${event}`)
  } catch (error) {
    console.error(`发送事件到窗口 ${targetWindowLabel} 失败:`, error)
    throw error
  }
}

/**
 * 向所有窗口广播事件
 * @param event 事件名称
 * @param payload 事件数据
 */
export async function broadcastToAllWindows<T = unknown> (
  event: string,
  payload?: T
): Promise<void> {
  try {
    // 使用全局 emit 向所有窗口发送事件
    await emit(event, payload)
    console.log(`已广播事件: ${event}`)
  } catch (error) {
    console.error(`广播事件 ${event} 失败:`, error)
    throw error
  }
}

/**
 * 监听来自其他窗口的事件
 * @param event 事件名称
 * @param handler 事件处理函数
 * @returns 取消监听的函数
 */
export async function listenFromWindow<T = any> (
  event: string,
  handler: (payload: T) => void
): Promise<() => void> {
  try {
    const unlisten = await listen<T>(event, (event) => {
      handler(event.payload)
    })

    console.log(`已监听事件: ${event}`)

    // 返回取消监听的函数
    return unlisten
  } catch (error) {
    console.error(`监听事件 ${event} 失败:`, error)
    throw error
  }
}
