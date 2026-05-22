export function getFetchDOMReq (
  url: string,
  config?: Partial<RequestInit>
) {
  const request = new Request(url, {
    method: 'GET',
    ...config,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
  return request
}


export async function parseDirtyDom (res: Response): Promise<Document> {
  try {
    const domText = await res.text()
    return new DOMParser().parseFromString(domText, 'text/html')
  } catch (err) {
    console.warn('解析 DOM 出错', err)
    return new DOMParser().parseFromString('', 'text/html')
  }
}

export async function fetchPlainText (
  url: string,
  config: Partial<RequestInit>
): Promise<string> {
  return fetch(url, {
    ...config,
  }).then(res => res.text()).then((textRes) => textRes)
}
