import md5 from 'md5'
import type { Language } from '../languages'
import { TranslateError } from '../translator'
import Baidu from './src'
import type { GetFetchRequest } from '../translator/request-types'
import type { GetSrcPageFunction } from '@P/api-server/types'

export const getRequest: GetFetchRequest<{
  appid: string
  key: string
}> = (text, {
  from,
  to,
  option,
}) => {
  const salt = Date.now()
  const searchParam = new URLSearchParams()
  let baseURL = 'https://api.fanyi.baidu.com/api/trans/vip/translate'
  if (searchParam.toString()) {
    baseURL += '?' + searchParam.toString()
  }
  return new Request(baseURL, {
    body: JSON.stringify({
      from,
      to,
      q: text,
      salt,
      appid: option.appid,
      sign: md5(option.appid + text + salt + option.key),
    }),
  })
}

type BaiduTranslateResult = {
  from: string;
  to: string;
  trans_result: Array<{
    dst: string;
    src: string;
  }>;
  lan?: Language;
}
type BaiduTranslateError = {
  error_code: '54001' | string;
  error_msg: 'Invalid Sign' | string;
}
export const handleResponse = async (res: Response) => {
  const data = await res.json()
  const translateError = data as BaiduTranslateError
  const error = translateError.error_code
  if (error) {
    // https://api.fanyi.baidu.com/api/trans/product/apidoc#joinFile
    console.error(new Error('[Baidu service]' + error))
    switch (error) {
      case '52003':
      case '54000':
        throw new TranslateError('AUTH_ERROR', translateError.error_msg)
      case '54004':
        throw new TranslateError('USEAGE_LIMIT', translateError.error_msg)
      default:
        throw new TranslateError('UNKNOWN', translateError.error_msg)
    }
  }

  const {
    trans_result: transResult,
    from: langDetected,
  } = data as BaiduTranslateResult
  const transParagraphs = transResult.map(({ dst }) => dst)
  const detectedFrom = Baidu.langMapReverse.get(langDetected) as Language

  return {
    text,
    from: detectedFrom,
    to,
    origin: {
      paragraphs: transResult.map(({ src }) => src),
      tts: getTextSpeech({ text, lang: detectedFrom }),
    },
    trans: {
      paragraphs: transParagraphs,
      tts: getTextSpeech(transParagraphs.join(' '), to),
    },
  }
}

export const getTextSpeech = ({
  text,
  lang,
}: {
  text: string
  lang: Language
}) => {
  return `https://fanyi.baidu.com/gettts?${new URLSearchParams({
    lan: Baidu.langMap.get(lang !== 'auto' ? lang : 'zh-CN') || 'zh',
    text,
    spd: '5',
  }).toString()}`
}

export const getSrcPage: GetSrcPageFunction = (text, config, dictProfile) => {
  let lang
  if (dictProfile.baidu.options.tl === 'default') {
    if (config.langCode === 'zh-CN') {
      lang = 'zh'
    } else if (config.langCode === 'zh-TW') {
      lang = 'cht'
    } else {
      lang = 'en'
    }
  } else {
    lang = dictProfile.baidu.options.tl
  }

  return `https://fanyi.baidu.com/#auto/${lang}/${text}`
}
