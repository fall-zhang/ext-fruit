import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { AuthBody } from './config'
import type { ParagraphResponse } from '../../types/res-type'
import type { SogouRes } from './type'
import { SALT, sougoLangMap } from './engine'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode) => {
  let lang: string
  if (localLangCode === 'zh-CN') {
    lang = 'zh-CHS'
  } else if (localLangCode === 'zh-TW') {
    lang = 'zh-CHT'
  } else {
    lang = 'en'
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

  const url = 'http://fanyi.sogou.com/reventondc/api/sogouTranslate'

  const body = {
    from: sougoLangMap.get(from) || 'auto',
    to: sougoLangMap.get(to) || 'auto',
    text,
    pid,
    q: text,
    key,
    salt: SALT,
  }

  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const handleResponse: AtomResponseHandle = async (res, {
  text,
  from,
  to,
  profile,
}) => {
  const data: SogouRes = await res.json()

  if (res.status === 401) {
    throw new Error('Sogou auth error: invalid credentials')
  }
  const result: ParagraphResponse = {
    engin: 'sogou',
    type: 'paragraph-trans',
    from,
    to,
    text: '',
    translate: '',
    pronounce: [],
  }
  //   {
  //   result: {
  //     id: 'sogou',
  //     sl: data.from || from || 'auto',
  //     tl: data.to || to || 'en',
  //     // slInitial: profile?.sogou?.options?.slInitial || 'collapse',
  //     searchText: data.origin,
  //     trans: data.trans,
  //   },
  //   audio: {
  //     py: data.trans?.tts,
  //     us: data.trans?.tts,
  //   },
  // }
  return result
}
