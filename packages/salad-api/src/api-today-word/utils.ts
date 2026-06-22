export async function fetchDirtyDOM (
  url: string,
  config?: Partial<RequestInit>
): Promise<Document> {
  const request = new Request(url, {
    method: 'GET',
    ...config,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })

  return fetch(request).then((res) => {
    return res.text()
  }).then(res => {
    // console.log('⚡️ line:21 ~ res: ', res)
    return new DOMParser().parseFromString(res, 'text/html')
  })
}
