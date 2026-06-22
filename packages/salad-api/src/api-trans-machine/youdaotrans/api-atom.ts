import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { ParagraphResponse } from '../../types/res-type'
import type { AuthBody } from './config'
import { langMap, truncate } from './engine'
import sha256 from 'crypto-js/sha256'
import { TranslateError } from '@P/open-trans/translator'

export const getSrcPage: AtomGetSrcFunction = () => {
  return 'http://fanyi.youdao.com'
}

export const getFetchRequest: AtomFetchRequest<AuthBody> = (text, opt) => {
  const appKey = opt.option?.appKey
  const key = opt.option?.key
  if (!appKey || !key) {
    throw new Error('youdaotrans error, 未填写认证参数')
  }
  // const translatorConfig = appKey && key ? { appKey, key } : undefined

  // const result = await translator.translate(text, opt.from, opt.to, translatorConfig)
  const salt = new Date().getTime().toString()
  const curTime = Math.round(new Date().getTime() / 1000).toString()

  const str1 = appKey + truncate(text) + salt + curTime + key
  const sign = sha256(str1).toString()
  const search = new URLSearchParams({
    q: text,
    appKey,
    salt,
    from: langMap.get(opt.from) || 'auto',
    to: langMap.get(opt.to) || 'auto',
    sign,
    signType: 'v3',
    curtime: curTime,
  })
  const url = new URL('https://openapi.youdao.com/api?' + search.toString())
  const request = new Request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return request
}

export const handleResponse: AtomResponseHandle = async (res, { from, to, text }) => {
  const jsonRes = await res.json()

  if (jsonRes.data.errorCode) {
    switch (jsonRes.data.errorCode) {
      case '0':
        break // means success
      case '101': // params error
      case '108':
        throw new TranslateError('AUTH_ERROR', jsonRes.data.errorCode)
      case '401':
        throw new TranslateError('USAGE_LIMIT', jsonRes.data.errorCode)
      default:
        throw new TranslateError('UNKNOWN', jsonRes.data.errorCode)
    }
  }
  const paragraphRes: ParagraphResponse = {
    engin: 'youdaotrans',
    type: 'paragraph-trans',
    from,
    to,
    text,
    translate: jsonRes.data.translation,
    pronounce: [],
  }
  return paragraphRes
}
