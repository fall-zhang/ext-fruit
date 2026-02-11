import { message, openUrl } from '@/_helpers/browser-api'
import { injectDictPanel } from '@/_helpers/injectSaladictInternal'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'
import type {
  SearchFunction,
  DictSearchResult,
  GetSrcPageFunction
} from '@/components/Dictionaries/helpers'
import {
  saveWord,
  deleteWords,
  getWordsByText,
  getWords
} from './database'
import { AudioManager } from './audio-manager'
import { QsPanelManager } from './windows-manager'
import './types'
import type { DictID } from '@P/saladict-core/src/app-config'
/**
 * background script as transfer station
 */
export class BackgroundServer {
  private static instance: BackgroundServer

  static getInstance () {
    return (
      BackgroundServer.instance ||
      (BackgroundServer.instance = new BackgroundServer())
    )
  }

  static init = BackgroundServer.getInstance

  static getDictEngine<P = unknown> (
    id: DictID
  ): Promise<{
    search: SearchFunction<DictSearchResult<any>, P>
    getSrcPage: GetSrcPageFunction
  }> {
    return import(
      /* webpackInclude: /engine\.ts$/ */
      /* webpackMode: "lazy" */
      `@/components/Dictionaries/${id}/engine.ts`
    )
  }

  private qsPanelManager: QsPanelManager

  // singleton
  private constructor () {
    this.qsPanelManager = new QsPanelManager()

    message.addListener((msg, sender: browser.runtime.MessageSender) => {
      switch (msg.type) {
        // case 'OPEN_URL':
        //   return openUrl(msg.payload)
        // case 'INJECT_DICTPANEL':
        //   return injectDictPanel(sender.tab)
        // case 'QUERY_QS_PANEL':
        //   return this.qsPanelManager.hasCreated()
        // case 'CLOSE_QS_PANEL':
        //   AudioManager.getInstance().reset()
        //   return this.qsPanelManager.destroy()
        // case 'QS_SWITCH_SIDEBAR':
        //   return this.qsPanelManager.toggleSidebar(msg.payload)
        // case 'DELETE_WORDS':
        //   return deleteWords(msg.payload).then(response => {
        //     return response
        //   })
        // case 'GET_WORDS_BY_TEXT':
        //   return getWordsByText(msg.payload)
        // case 'GET_WORDS':
        //   return getWords(msg.payload)
      }
    })

    browser.runtime.onConnect.addListener(port => {
      if (port.name === 'popup') {
        // This is a workaround for browser action page
        // which does not fire beforeunload event
        port.onDisconnect.addListener(() => {
          AudioManager.getInstance().reset()
        })
      }
    })
  }

  async openQSPanel (): Promise<void> {
    if (await this.qsPanelManager.hasCreated()) {
      await this.qsPanelManager.focus()
      return
    }
    await this.qsPanelManager.create()
  }

  async searchClipboard (): Promise<void> {
    const word = newWord({ text: await getTextFromClipboard() })

    if (await this.qsPanelManager.hasCreated()) {
      await message.send({
        type: 'QS_PANEL_SEARCH_TEXT',
        payload: word,
      })
      return
    }

    await this.qsPanelManager.create(word)
  }

  async searchPageSelection (): Promise<void> {
    const tabs = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })

    let word: Word | undefined

    const hasCreated = await this.qsPanelManager.hasCreated()

    if (hasCreated) {
      await this.qsPanelManager.focus()
    } else {
      await this.qsPanelManager.create(word)
    }
  }
}
