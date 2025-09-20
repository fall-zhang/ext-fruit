import { FC } from 'react'
import { Helmet } from 'react-helmet'
// import { AppConfig } from '@/app-config'
// import { getConfig } from '@/_helpers/config-manager'
import { message, openUrl } from '@/_helpers/browser-api'
import { saveWord, Word } from '@/_helpers/record-manager'
import { translateCtxs, genCtxText } from '@/_helpers/translateCtx'
import { Message } from '@/types/message'

import { createStore } from '@/content/redux'

import { I18nContextProvider, useTranslate } from '@/_helpers/i18n'

import Popup from './Popup'
import Notebook from './Notebook'
import './_style.scss'
import { createRoot } from 'react-dom/client'
import { AppConfig, getDefaultConfig } from '../../app-config'

// This is a workaround for browser action page
// which does not fire beforeunload event
browser.runtime.connect({ name: 'popup' } as any) // wrong typing

const Title: FC = () => {
  const { t } = useTranslate('popup')
  return (
    <Helmet>
      <title>{t('title')}</title>
    </Helmet>
  )
}

async function showPanel (config: AppConfig) {
  const store = await createStore()
  const root = createRoot(document.getElementById('root')!)
  root.render(<I18nContextProvider>
    <Title />
    <Popup config={config} />
  </I18nContextProvider>)
}

async function addNotebook () {
  let hasError = false
  let word: Word | undefined

  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const tab = tabs[0]
  if (tab && tab.id) {
    if (word && word.text) {
      try {
        await saveWord('notebook', word)
      } catch (err) {
        hasError = true
      }
    }
  } else {
    hasError = true
  }
  const root = createRoot(document.getElementById('root')!)
  root.render(<I18nContextProvider>
    <Notebook word={word} hasError={hasError} />
  </I18nContextProvider>)


  // async get translations
  if (word && word.context) {
    const config = getDefaultConfig()
    word.trans = genCtxText(
      word.trans,
      await translateCtxs(word.context || word.title, config.ctxTrans)
    )
    try {
      await saveWord('notebook', word)
    } catch (err) {
      /* */
    }
  }
}

function openOptions () {
  openUrl('options.html', true)
}

async function sendContextMenusClick (menuItemId: string) {
  const payload: Message<'CONTEXT_MENUS_CLICK'>['payload'] = {
    menuItemId
  }


  await message.send({
    type: 'CONTEXT_MENUS_CLICK',
    payload
  })
}
