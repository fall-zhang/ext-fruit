import { createFileRoute } from '@tanstack/react-router'
import { getCurrentWindow, Window } from '@tauri-apps/api/window'
import { useEffect, useState } from 'react'
import { PinBtn } from './-components/pin-button'
import { CloseBtn } from './-components/close-button'
import { FavBtn } from './-components/fav-button'
import type { SaladConfigType } from '@/config/app-config/config-type'
import { SaladPanel } from './-panel-view/salad-panel'
import { listenFromWindow } from '@/core/bridge'
import { message } from 'antd'
/**
 * 生词本
 */
export const Route = createFileRoute('/search-view/')({
  component: RouteComponent,
})
const appWindow = new Window('search-view')

function RouteComponent () {
  const [isAlwaysOnTop, setAlwaysOnTop] = useState(false)
  const [isInNotebook, setIsInNotebook] = useState(false)
  const [saladictConf] = useState<SaladConfigType>()

  // 窗口间通信示例：监听来自配置窗口的消息
  useEffect(() => {
    // let unlisten: (() => void) | null = null
    let unListenRec: (() => void) | null = null

    const setupListener = async () => {
      try {
        // 监听自定义消息事件（用于演示）
        const unListen = await listenFromWindow<{ text: string; timestamp: number }>(
          'custom-message',
          (payload) => {
            console.log('搜索窗口收到自定义消息:', payload)
            message.success(`收到消息: ${payload.text}`)
          }
        )
        if (unListenRec) {
          unListen()
          return
        }
        unListenRec = unListen

        console.log('搜索窗口已设置事件监听器')
      } catch (error) {
        console.error('设置监听器失败:', error)
      }
    }

    setupListener()

    // 组件卸载时清理监听器
    return () => {
      if (unListenRec) {
        console.log('⚡️ line:63 ~ unListenRec: 取消监听')
        unListenRec()
      }
    }
  }, [])

  useEffect(() => {
    async function getInitInfo () {
      const isAlwaysOnTop = await appWindow.isAlwaysOnTop()
      setAlwaysOnTop(isAlwaysOnTop)
    }
    getInitInfo()
  }, [])
  async function togglePin () {
    if (isAlwaysOnTop) {
      appWindow.setAlwaysOnTop(false)
      setAlwaysOnTop(false)
    } else {
      appWindow.setAlwaysOnTop(true)
      setAlwaysOnTop(true)
    }
  }
  function toggleFavState () {

  }
  async function closeWindow () {
    const state = await getCurrentWindow().hide()
  }
  return <>
    <div className='w-full relative h-screen '>
      <SaladPanel
        config={saladictConf}
        customButton={
          <>
            <FavBtn
              isFav={isInNotebook}
              onClick={toggleFavState}
            />
            <PinBtn
              isPinned={isAlwaysOnTop}
              onClick={togglePin}
            />
            <CloseBtn onClick={closeWindow} />
          </>
        }
      />
    </div>
  </>
}
