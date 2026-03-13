import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { fetch } from '@tauri-apps/plugin-http'
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
  // fetch(url).then(res => res.text()).then(res => {
  //   console.log('⚡️ line:15 ~ res: ', res)
  // }).catch(err => {
  // })
  return fetch(request).then((res) => {
    return res.text()
  }).then(res => {
    console.log('⚡️ line:21 ~ res: ', res)
    return new DOMParser().parseFromString(res, 'text/html')
  })
}

export async function fetchPlainText (
  url: string,
  config: Partial<RequestInit>
): Promise<string> {
  return fetch(url, {
    ...config,
  }).then(res => res.text()).then((textRes) => textRes)
}
