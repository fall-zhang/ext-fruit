import React from 'react'
import SaladBowlContainer from '@/content/components/SaladBowl/SaladBowl.container'
import DictPanelContainer from '@/content/components/DictPanel/DictPanel.container'
import WordEditorContainer from '@/content/components/WordEditor/WordEditor.container'
import { timer } from '@/_helpers/promise-more'
import { AntdRootContainer } from './AntdRootContainer'

import './_style.scss'
import { createRoot } from 'react-dom/client'

export const initAntdRoot = async (
  render: () => React.ReactNode,
  gaPath?: string
): Promise<void> => {
  const store = await createStore()

  // update theme as quickly as possible
  let { darkMode } = store.getState().config
  await switchAntdTheme(darkMode)
  store.subscribe(() => {
    const { config } = store.getState()
    if (config.darkMode !== darkMode) {
      darkMode = config.darkMode
      switchAntdTheme(darkMode)
    }
  })
  const root = createRoot(document.getElementById('root')!)
  root.render(<>
    <AntdRootContainer gaPath={gaPath} render={render} />
    <SaladBowlContainer panelCSS={''} x={0} y={0} enableHover={false} onActive={ () => {} } show={false} withAnimation={false} />
    <DictPanelContainer darkMode={false} panelCSS={''} fontSize={0} show={false} withAnimation={false} coord={{
      x: 0,
      y: 0,
    }} takeCoordSnapshot={false} width={0} height={0} maxHeight={0} menuBar={undefined} mtaBox={undefined} dictList={undefined} waveformBox={undefined} dragStartCoord={null} onDragEnd={function (): void {
      throw new Error('Function not implemented.')
    } } />
    <WordEditorContainer darkMode={false} ctxTrans={undefined} show={false} withAnimation={false} onClose={function (): void {
      throw new Error('Function not implemented.')
    } } containerWidth={0} wordEditor={{
      word: undefined,
      translateCtx: false,
    }} />
  </>)
}

async function switchAntdTheme (darkMode: boolean): Promise<void> {
  const $root = document.querySelector('#root')!

  await new Promise(resolve => {
    const filename = `antd${darkMode ? '.dark' : ''}.min.css`
    const href =
      process.env.NODE_ENV === 'development'
        ? `https://cdnjs.cloudflare.com/ajax/libs/antd/4.1.0/${filename}`
        : `/assets/${filename}`
    let $link = document.head.querySelector<HTMLLinkElement>(
      'link#saladict-antd-theme'
    )

    if ($link && $link.getAttribute('href') === href) {
      resolve('')
      return
    }

    // smooth dark/bright transition
    $root.classList.toggle('saladict-theme-dark', darkMode)
    $root.classList.toggle('saladict-theme-bright', !darkMode)
    $root.classList.toggle('saladict-theme-loading', true)

    if ($link) {
      $link.setAttribute('href', href)
    } else {
      $link = document.createElement('link')
      $link.setAttribute('id', 'saladict-antd-theme')
      $link.setAttribute('rel', 'stylesheet')
      $link.setAttribute('href', href)
      document.head.insertBefore($link, document.head.firstChild)
    }

    let loaded = false

    $link.onreadystatechange = function () {
      if (this.readyState === 'complete' || this.readyState === 'loaded') {
        if (loaded === false) {
          resolve()
        }
        loaded = true
      }
    }

    $link.onload = function () {
      if (loaded === false) {
        resolve()
      }
      loaded = true
    }

    const img = document.createElement('img')
    img.onerror = function () {
      if (loaded === false) {
        resolve()
      }
      loaded = true
    }
    img.src = href
  })

  await timer(500)

  $root.classList.toggle('saladict-theme-loaded', true)
  $root.classList.toggle('saladict-theme-loading', false)
}
