

function setIcon (gray: boolean, tabId: number) {
  browser.browserAction.setIcon({
    tabId,
    path: gray
      ? {
        16: 'assets/icon-gray-16.png',
        19: 'assets/icon-gray-19.png',
        24: 'assets/icon-gray-24.png',
        38: 'assets/icon-gray-38.png',
        48: 'assets/icon-gray-48.png',
        128: 'assets/icon-gray-128.png'
      }
      : {
        16: 'assets/icon-16.png',
        19: 'assets/icon-19.png',
        24: 'assets/icon-24.png',
        38: 'assets/icon-38.png',
        48: 'assets/icon-48.png',
        128: 'assets/icon-128.png'
      }
  })
}
