import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GoogleResult, SupportLang } from './type'
import type { ParagraphResponse } from '../../types/res-type'

export const getSrcPage: AtomGetSrcFunction = (text, targetLang: SupportLang) => {
  const domain = 'com'
  const lang: SupportLang = targetLang

  return `https://translate.google.${domain}/#auto/${lang}/${text}`
}

export const getFetchRequest: AtomFetchRequest<{
  token: string
}> = (text, {
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
  // const result = await translator.translate(text, sl, tl, {
  //   concurrent: options.concurrent,
  //   apiAsFallback: true,
  //   order: [],
  // })
  return new Request(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
}

export const handleResponse: AtomResponseHandle = async (res, {
  text,
  from,
  to,
}) => {
  const data = await res.json()

  const result: ParagraphResponse = {
    engin: 'google',
    type: 'paragraph-trans',
    from,
    to,
    text,
    translate: data.trans,
    pronounce: [],
  }
  return result
}
