export async function notifyError (
  id: string,
  error: Error | string,
  msgPrefix = '',
  msgPostfix = ''
): Promise<void> {
  const errorText = typeof error === 'string' ? error : error.message
  const msg = `Unknown error: ${errorText}`

  browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('assets/icon-128.png'),
    title: `Saladict ${`sync:${id}.title`}`,
    message: msgPrefix + msg + msgPostfix,
    eventTime: Date.now() + 20000,
    priority: 2,
  })
}
