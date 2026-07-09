import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import md5 from 'md5'
import type { AuthBody } from './config'
import type { BaiduTranslateError, BaiduTranslateResult } from './type'
import type { UnitSearchResult } from '../../types/res-type'
import type { SupportLanguage } from '../../main'
import { langMap } from './engine'
import { TranslateError } from '../../types/error-type'

export const getSrcPage: AtomGetSrcFunction = (text, langCode) => {
  let lang
  if (langCode === 'zh-CN') {
    lang = 'zh'
  } else if (langCode === 'zh-TW') {
    lang = 'cht'
  } else {
    lang = 'en'
  }

  return `https://fanyi.baidu.com/#auto/${lang}/${text}`
}

export const getFetchRequest: AtomFetchRequest<AuthBody> = (text, {
  from,
  to,
  option,
}) => {
  const salt = Date.now().toString()
  const langToBaidu = new Map(langMap)
  const reqBody = {
    from: langToBaidu.get(from) || 'auto',
    to: langToBaidu.get(from) || 'en',
    q: text,
    salt,
    appid: option?.appid || '',
    key: option?.key || '',
    sign: md5(option?.appid + text + salt + option?.key),
  }

  const searchParam = new URLSearchParams(reqBody)
  let baseURL = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
  if (searchParam.toString()) {
    baseURL += '?' + searchParam.toString()
  }

  return new Request(baseURL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // body: JSON.stringify(reqBody),
  })
}

export const handleResponse: AtomResponseHandle = async (res, {
  text,
  from,
  to,
}) => {
  const data = await res.json()
  const translateError = data as BaiduTranslateError
  const error = translateError.error_code
  if (error) {
    console.error(new Error('[Baidu service]' + error))
    switch (error) {
      case '52003':
      case '54000':
        throw new TranslateError('AUTH_ERROR', translateError.error_msg)
      case '54004':
        throw new TranslateError('USAGE_LIMIT', translateError.error_msg)
      default:
        throw new TranslateError('UNKNOWN', translateError.error_msg)
    }
  }

  const {
    trans_result: transResult,
    // from: langDetected,
  } = data as BaiduTranslateResult
  const transParagraphs = transResult.map(({ dst }) => dst)
  // const detectedFrom = Baidu.langMapReverse.get(langDetected) || 'auto'
  const transTTS = getTextSpeech({
    lang: to,
    text: transParagraphs.join(' '),
  })

  return {
    engin: 'baidu',
    type: 'paragraph-trans',
    from,
    to,
    text,
    pronounce: [{
      lang: to,
      src: transTTS,
    }],
    translate: transParagraphs[0],
  } satisfies UnitSearchResult
}

const getTextSpeech = ({
  text,
  lang,
}: {
  text: string
  lang: SupportLanguage
}) => {
  const langToBaidu = new Map(langMap)

  return `https://fanyi.baidu.com/gettts?${new URLSearchParams({
    lan: langToBaidu.get(lang !== 'auto' ? lang : 'zh-CN') || 'zh',
    text,
    spd: '5',
  }).toString()}`
}
