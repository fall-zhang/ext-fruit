import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { AuthBody } from './config'
import { getUTCDate, tencentLangMap } from './engine'
import type { TencentResult } from './type'
import { TranslateError } from '@P/open-trans/translator'
import type { ParagraphResponse } from '../../types/res-type'
import HMACSHA256 from 'crypto-js/hmac-sha256'

export const getSrcPage: AtomGetSrcFunction = (text, localLang) => {
  let lang
  if (localLang === 'zh-CN') {
    lang = 'zh-CHS'
  } else if (localLang === 'zh-TW') {
    lang = 'zh-CHT'
  } else {
    lang = 'en'
  }
  return `https://fanyi.qq.com/#auto/${lang}/${text}`
}

/**
 * 该方法暂时不可用
 */
export const getFetchRequest: AtomFetchRequest<AuthBody> = async (text, opt) => {
  const secretId = opt.option?.secretId
  const secretKey = opt.option?.secretKey
  const translatorConfig = (secretId && secretKey) ? { secretId, secretKey } : undefined
  const from = tencentLangMap.get(opt.from) || 'auto'
  const to = tencentLangMap.get(opt.to) || 'auto'

  // API auth handle
  const now = new Date()
  const datestamp = getUTCDate(now)
  const timestamp = `${new Date().valueOf()}`.slice(0, 10)

  const SecretDate = HMACSHA256(datestamp, `TC3${secretKey}`)

  return new Request('https://tmt.tencentcloudapi.com', {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      ProjectId: 0,
      Source: from,
      SourceText: text,
      Target: to,
    }),
  })
}
export const handleResponse: AtomResponseHandle = async (response, { from, to, text }) => {
  const res: TencentResult = await response.json()
  if (res.Response.Error && res.Response.Error.Code) {
    switch (res.Response.Error.Code) {
      case 'AuthFailure.SecretIdNotFound':
      case 'AuthFailure.InvalidSecretId':
        throw new TranslateError('AUTH_ERROR', res.Response.Error.Code)
      case 'FailedOperation.NoFreeAmount':
      case 'FailedOperation.UserHasNoFreeAmount':
      case 'FailedOperation.ServiceIsolate':
        throw new TranslateError('USAGE_LIMIT', res.Response.Error.Code)
      default:
        throw new TranslateError('UNKNOWN', res.Response.Error.Code)
    }
  }
  const result: ParagraphResponse = {
    engin: 'tencent',
    type: 'paragraph-trans',
    from: 'af',
    to: 'af',
    text: '',
    translate: '',
    pronounce: [],
  }
  return result
}
