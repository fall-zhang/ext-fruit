// 更新配置
import { listen } from '@tauri-apps/api/event'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

/**
 * 向指定窗口发送事件
 * @param targetWindowLabel 目标窗口的 label
 * @param event 事件名称
 * @param payload 事件数据
 */
export async function sendConfigUpdate<T = unknown> (
  targetWindowLabel: 'config-view' | 'search-view',
  payload?: T
): Promise<void> {
  try {
    // 获取目标窗口
    const targetWindow = await WebviewWindow.getByLabel(targetWindowLabel)
    if (!targetWindow) {
      console.warn(`目标窗口不存在: ${targetWindowLabel}，取消配置同步`)
      return
    }

    // 向目标窗口发送事件
    await targetWindow.emit('conf-updated', payload)
    console.log(`已向窗口 ${targetWindowLabel} 发送事件: ${'conf-updated'}`)
  } catch (error) {
    console.error(`发送事件到窗口 ${targetWindowLabel} 失败:`, error)
    throw error
  }
}
/**
 * 监听来自其他窗口的事件
 * @param event 事件名称
 * @param handler 事件处理函数
 * @returns 取消监听的函数
 */
export async function listenConfigUpdate<T = unknown> (
  handler: (payload: T) => void
): Promise<() => void> {
  try {
    const unListen = await listen<T>('conf-updated', (event) => {
      handler(event.payload)
    })

    console.log(`已监听事件: ${'conf-updated'}`)

    // 返回取消监听的函数
    return unListen
  } catch (error) {
    console.error(`监听事件 ${'conf-updated'} 失败:`, error)
    throw error
  }
}
