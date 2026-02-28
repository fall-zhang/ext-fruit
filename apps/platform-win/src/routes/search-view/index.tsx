import { CloseBtn, PinBtn } from '@P/saladict-core/src/views/salad-panel/MenuBar/MenubarBtns'
import { SaladPanel } from '@P/saladict-core/src/views/salad-panel/salad-panel'
import { createFileRoute } from '@tanstack/react-router'
import { Window } from '@tauri-apps/api/window'
import { fetch } from '@tauri-apps/plugin-http'
import { useEffect, useState } from 'react'

/**
 * 生词本
 */
export const Route = createFileRoute('/search-view/')({
  component: RouteComponent,
})
const appWindow = new Window('main-page')

function RouteComponent () {
  const [isAlwaysOnTop, setAlwaysOnTop] = useState(false)
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

  return <>
    <div data-tauri-drag-region className="app-titlebar flex w-screen justify-end">
      <div className="titlebar-button" onClick={appWindow.minimize}>
        <img
          src="https://api.iconify.design/mdi:window-minimize.svg"
          alt="minimize"
        />
      </div>
      <div className="titlebar-button" onClick={appWindow.close}>
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
      </div>
    </div>
    <div className='w-full h-full relative'>
      <SaladPanel menuBarProps={{
        'data-tauri-drag-region': true,
      }}
      customFetch={fetch}
      customButton={
        <>
          <PinBtn
            isPinned={isAlwaysOnTop}
            onClick={togglePin}

          />
          <CloseBtn onClick={appWindow.close} />
        </>
      }
      />
    </div>
  </>
}
