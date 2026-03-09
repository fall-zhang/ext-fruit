import { SaladPanel } from '.-panel-view/salad-panel'
import { createFileRoute } from '@tanstack/react-router'
import { Window } from '@tauri-apps/api/window'
import { fetch } from '@tauri-apps/plugin-http'
import { useEffect, useState } from 'react'
import { PinBtn } from './-components/pin-button'
import { CloseBtn } from './-components/close-button'
import { FavBtn } from './-components/fav-button'
import type { SaladictConfig } from '@P/saladict-core/main'
/**
 * 生词本
 */
export const Route = createFileRoute('/search-view/')({
  component: RouteComponent,
})
const appWindow = new Window('main-page')

function RouteComponent () {
  const [isAlwaysOnTop, setAlwaysOnTop] = useState(false)
  const [isInNotebook, setIsInNotebook] = useState(false)
  const [curSearchText, setCurSearchText] = useState('')
  const [saladictConf] = useState<SaladictConfig>()
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
  return <>
    <div className='w-full h-full relative'>
      <SaladPanel
        menuBarProps={{
          'data-tauri-drag-region': true,
        }}
        customFetch={fetch}
        onSearchChange={(text) => { setCurSearchText(text) }}
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
            <CloseBtn onClick={appWindow.close} />
          </>
        }
      />
    </div>
  </>
}
