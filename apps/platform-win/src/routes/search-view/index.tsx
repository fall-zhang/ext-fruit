import { createFileRoute } from '@tanstack/react-router'
import { getCurrentWindow, Window } from '@tauri-apps/api/window'
import { useEffect, useState } from 'react'
import { PinBtn } from './-components/pin-button'
import { CloseBtn } from './-components/close-button'
import { FavBtn } from './-components/fav-button'
import type { SaladConfigType } from '@/config/app-config/config-type'
import { SaladPanel } from './-panel-view/salad-panel'
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
