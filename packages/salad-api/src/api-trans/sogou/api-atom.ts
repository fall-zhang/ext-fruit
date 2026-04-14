import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { SogouResult } from './type'
import type { SogouConfig, AuthBody } from './config'
import { Sogou } from '@salad/trans/service-sogou/index'
import { detectLangInfo } from '../../api-common/detect-lang'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode, profile) => {
  let lang: string
  if (profile.sogou.options.tl === 'default') {
    if (localLangCode === 'zh-CN') {
      lang = 'zh-CHS'
    } else if (localLangCode === 'zh-TW') {
      lang = 'zh-CHT'
    } else {
      lang = 'en'
    }
  } else {
    lang = profile.sogou.options.tl
  }

  return `https://fanyi.sogou.com/#auto/${lang}/${text}`
}

export const getFetchRequest: AtomFetchRequest<AuthBody> = (text, {
  from,
  to,
  option,
}) => {
  const pid = option?.pid || ''
  const key = option?.key || ''

  const { from: sl, to: tl } = detectLangInfo(text, {
    from,
    to,
    localLang: 'auto',
  })

  const url = `https://fanyi.sogou.com/api/transresult`

  const body = {
    from: sl,
    to: tl,
    text,
    pid,
    key,
  }

  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const handleResponse: AtomResponseHandle<SogouResult> = async (res, {
  text,
  from,
  to,
  profile,
}) => {
  const data = await res.json()

  if (res.status === 401) {
    throw new Error('Sogou auth error: invalid credentials')
  }

  return {
    result: {
      id: 'sogou',
      sl: data.from || from || 'auto',
      tl: data.to || to || 'en',
      slInitial: profile?.sogou?.options?.slInitial || 'collapse',
      searchText: data.origin,
      trans: data.trans,
    },
    audio: {
      py: data.trans?.tts,
      us: data.trans?.tts,
    },
  }
}
