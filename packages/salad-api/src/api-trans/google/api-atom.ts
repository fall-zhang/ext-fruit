import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GoogleResult } from './type'
import type { GoogleConfig } from './config'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode, profile) => {
  const domain = 'com'
  const lang =
    profile.google.options.tl === 'default'
      ? localLangCode
      : profile.google.options.tl

  return `https://translate.google.${domain}/#auto/${lang}/${text}`
}

export const getFetchRequest: AtomFetchRequest<GoogleConfig> = (text, {
  from,
  to,
  option,
}) => {
  const token = option?.token || ''

  const url = 'https://translate.google.com/translate_a/single'

  const params = new URLSearchParams({
    client: 'gtx',
    sl: from || 'auto',
    tl: to || 'en',
    dt: 't',
    q: text,
  })

  return new Request(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
}

export const handleResponse: AtomResponseHandle<GoogleResult> = async (res, {
  text,
  from,
  to,
  profile,
}) => {
  const data = await res.json()

  if (res.status === 401 || res.status === 429) {
    throw new Error('Google auth error: rate limited or invalid token')
  }

  const paragraphs: string[] = []
  if (data?.[0]) {
    for (const item of data[0]) {
      if (item?.[0]) {
        paragraphs.push(item[0])
      }
    }
  }

  return {
    result: {
      id: 'google',
      sl: from || 'auto',
      tl: to || 'en',
      slInitial: profile?.google?.options?.slInitial || 'hide',
      searchText: { paragraphs: [text] },
      trans: { paragraphs },
    },
    audio: {
      py: paragraphs.join('\n'),
      us: paragraphs.join('\n'),
    },
  }
}
