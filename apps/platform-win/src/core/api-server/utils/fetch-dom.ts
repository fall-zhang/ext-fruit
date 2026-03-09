import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

export async function fetchDirtyDOM (
  url: string,
  config?: Request
): Promise<Document> {
  const request = new Request(url, {
    method: 'GET',
    ...config,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
  // fetch(url).then(res => res.text()).then(res => {
  //   console.log('⚡️ line:15 ~ res: ', res)
  // }).catch(err => {
  // })
  return fetch(request).then(({ text }) => {
    return text()
  }).then(res => {
    return new DOMParser().parseFromString(res, 'text/html')
  })
}

export async function fetchPlainText (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<string> {
  return axios(url, {
    withCredentials: false,
    ...config,
    responseType: 'text',
  }).then(({ data }) => data)
}
