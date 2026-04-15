import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { AuthBody } from './config'
import type { CaiyunResult } from './type'

export const getSrcPage: AtomGetSrcFunction = () => {
  return 'https://fanyi.caiyunapp.com/'
}

export const getFetchRequest: AtomFetchRequest<AuthBody> = (text, {
  from,
  to,
  option,
}) => {
  const token = option?.token || ''

  const url = 'https://api.interpreter.caiyunai.com/v1/translator'

  const body = {
    source: text.split(/\n+/),
    trans_type: `${from || 'auto'}2${to || 'en'}`,
    request_id: Date.now().toString(),
    detect: from === 'auto' || !from,
  }

  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-authorization': 'token ' + token,
    },
    body: JSON.stringify(body),
  })
}

export const handleResponse: AtomResponseHandle<CaiyunResult> = async (res, {
  text,
  from,
  to,
  profile,
}) => {
  const data = await res.json()

  if (res.status === 401) {
    throw new Error('Caiyun auth error: invalid token')
  }

  if (res.status === 500) {
    throw new Error('Caiyun usage limit exceeded')
  }

  return {
    result: {
      id: 'caiyun',
      sl: from || 'auto',
      tl: to || 'en',
      searchText: { paragraphs: text.split(/\n+/) },
      trans: { paragraphs: data.target || [] },
    },
  }
}
