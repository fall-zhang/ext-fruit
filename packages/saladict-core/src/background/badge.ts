import { message } from '@/_helpers/browser-api'
import { Subject } from 'rxjs'
import { switchMapBy } from '@/_helpers/observables'
import { timer } from '@/_helpers/promise-more'

interface UpdateBadgeOptions {
  active: boolean
  tempDisable: boolean
  unsupported: boolean
}

const onUpdated$ = new Subject<{
  delay?: boolean
  tabId: number
  options?: UpdateBadgeOptions
}>()

onUpdated$
  .pipe(
    switchMapBy('tabId', async o => {
      if (o.options) {
        return o as Required<typeof o>
      }

      if (o.delay) {
        await timer(1000)
      }

      return {
        tabId: o.tabId,
        options: (await message
          .send<'GET_TAB_BADGE_INFO'>(o.tabId, {
            type: 'GET_TAB_BADGE_INFO'
          })
          .catch(() => {})) || {
          active: window.appConfig.active,
          tempDisable: false,
          unsupported: true
        }
      }
    })
  )
  .subscribe(({ tabId, options }) => {
    if (options.tempDisable) {
      return setTempOff(tabId)
    }

    if (options.unsupported) {
      setIcon(true, tabId)

    }

    return setDefault(tabId)
  })

export function initBadge () {
  /** Sent when content script loaded */
  message.addListener('SEND_TAB_BADGE_INFO', ({ payload }, sender) => {
    if (sender.tab && sender.tab.id) {
      onUpdated$.next({ tabId: sender.tab.id, options: payload })
    }
  })
}
