interface Window {
  browser: typeof browser

  __SALADICT_PANEL_LOADED__?: boolean
  __SALADICT_SELECTION_LOADED__?: boolean

  // For self page messaging
  pageId?: number | string
  faviconURL?: string
  pageTitle?: string
  pageURL?: string

  __SALADICT_BACKGROUND_PAGE__?: boolean
  __SALADICT_INTERNAL_PAGE__?: boolean
  __SALADICT_OPTIONS_PAGE__?: boolean
  __SALADICT_POPUP_PAGE__?: boolean
  __SALADICT_QUICK_SEARCH_PAGE__?: boolean
  __SALADICT_PDF_PAGE__?: boolean

  // Options page
  __SALADICT_LAST_SEARCH__?: string


  __webpack_public_path__?: string
}

// scss file
declare module '*.scss'
