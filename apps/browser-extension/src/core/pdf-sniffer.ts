/**
 * Open pdf link directly
 */

import { openUrl } from '../utils/browser-api'

/**
 * @param url provide a url
 * @param force load the current tab anyway
 */
export async function openPDF (url?: string, force?: boolean) {
  let pdfURL = browser.runtime.getURL('assets/pdf/web/viewer.html')

  if (url) {
    pdfURL += '?file=' + encodeURIComponent(url)
  } else {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0 && tabs[0].url) {
      const curURL = tabs[0].url
      if (curURL.startsWith(pdfURL)) {
        return // ignore pdf viewer url
      } else if (force || curURL.endsWith('pdf')) {
        pdfURL += '?file=' + encodeURIComponent(curURL)
      }
    }
  }

  return openUrl({ url: pdfURL, unique: false })
}

export function extractPDFUrl (fullurl?: string): string | void {
  if (!fullurl) {
    return
  }
  const searchURL = new URL(fullurl)
  return decodeURIComponent(searchURL.searchParams.get('file') || '')
}

function startListening () {
  if (!browser.webRequest.onBeforeRequest.hasListener(otherPdfListener)) {
    browser.webRequest.onBeforeRequest.addListener(
      otherPdfListener,
      {
        urls: [
          'ftp://*/*.pdf',
          'ftp://*/*.PDF',
          'file://*/*.pdf',
          'file://*/*.PDF',
        ],
        types: ['main_frame', 'sub_frame'],
      },
      ['blocking']
    )
  }

  if (!browser.webRequest.onHeadersReceived.hasListener(httpPdfListener)) {
    browser.webRequest.onHeadersReceived.addListener(
      httpPdfListener,
      {
        urls: ['https://*/*', 'https://*/*', 'http://*/*', 'http://*/*'],
        types: ['main_frame', 'sub_frame'],
      },
      ['blocking', 'responseHeaders']
    )
  }
}

function stopListening () {
  browser.webRequest.onBeforeRequest.removeListener(otherPdfListener)
  browser.webRequest.onHeadersReceived.removeListener(httpPdfListener)
}

function otherPdfListener ({
  tabId,
  url,
}: Parameters<
  Parameters<typeof browser.webRequest.onBeforeRequest.removeListener>[0]
>[0]) {
  const redirectUrl = browser.runtime.getURL(
    `assets/pdf/web/viewer.html?file=${encodeURIComponent(url)}`
  )

  return { redirectUrl }
}

function httpPdfListener ({
  tabId,
  responseHeaders,
  url,
}: Parameters<
  Parameters<typeof browser.webRequest.onHeadersReceived.removeListener>[0]
>[0]) {
  if (!responseHeaders) {
    return
  }

  const contentTypeHeader = responseHeaders.find(
    ({ name }) => name.toLowerCase() === 'content-type'
  )
  if (contentTypeHeader && contentTypeHeader.value) {
    const contentType = contentTypeHeader.value.toLowerCase()
    if (
      contentType.endsWith('pdf') ||
      (contentType === 'application/octet-stream' && url.endsWith('.pdf'))
    ) {
      const redirectUrl = browser.runtime.getURL(
        `assets/pdf/web/viewer.html?file=${encodeURIComponent(url)}`
      )

      return { redirectUrl }
    }
  }
}

function openPDFStandalone (url: string) {
  return browser.windows.create({ type: 'popup', url })
}
