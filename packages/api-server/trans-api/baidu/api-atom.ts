import { Baidu } from '@P/open-trans/service-baidu'
import type { Language } from '@P/open-trans/languages'

import md5 from 'md5'

import { TranslateError } from '@P/open-trans/translator'
import type { BaiduTranslateError, BaiduTranslateResult } from './type'
import type { AuthBody } from './auth'
import { machineResult, type MachineTranslateResult } from '@P/api-server/api-common/result-handle'
import type { HandleFetchResponse, GetSrcPageFunction, GetFetchRequest } from '@P/api-server/api-common/atom-type'


export const getRequest: GetFetchRequest<AuthBody> = (text, {
  from,
  to,
  option,
}) => {
  const salt = Date.now().toString()
  const reqBody = {
    from: from || 'auto',
    to: to || 'en',
    q: text,
    salt,
    appid: option?.appid || '',
    key: option?.key || '',
    sign: md5(option?.appid + text + salt + option?.key),
  }
  // const appid = '20260228002563230'
  // const key = 'ujv5scyNwqVHs5_pZCaJ'
  // const reqBody2 = {
  //   from: 'auto',
  //   to: 'zh',
  //   q: 'pink',
  //   salt: Date.now().toString(),
  //   appid,
  //   key,
  //   sign: md5(appid + 'pink' + salt + key),
  // }
  // console.log('⚡️ line:32 ~ reqBody: ', reqBody)
  // console.log('⚡️ line:32 ~ reqBody: ', reqBody2)

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

export const handleResponse: HandleFetchResponse<MachineTranslateResult> = async (res, {
  text,
  from,
  to,
  profile,
}) => {
  const data = await res.json()
  console.log('⚡️ line:50 ~ data: ', data)
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
        throw new TranslateError('USAGE_LIMIT', translateError.error_msg)
      default:
        throw new TranslateError('UNKNOWN', translateError.error_msg)
    }
  }

  const {
    trans_result: transResult,
    from: langDetected,
  } = data as BaiduTranslateResult
  const transParagraphs = transResult.map(({ dst }) => dst)
  const detectedFrom = Baidu.langMapReverse.get(langDetected) || 'auto'
  const transTTS = getTextSpeech({
    lang: to,
    text: transParagraphs.join(' '),
  })
  return machineResult(
    {
      result: {
        id: 'baidu',
        slInitial: profile.baidu.options.slInitial,
        sl: from,
        tl: to,
        searchText: {
          paragraphs: transResult.map(({ src }) => src),
          tts: getTextSpeech({ text, lang: detectedFrom }),
        },
        trans: {
          paragraphs: transParagraphs,
          tts: getTextSpeech({
            lang: to,
            text: transParagraphs.join(' '),
          }),
        },
      },
      audio: {
        py: transTTS,
        us: transTTS,
      },
    },
    [...Baidu.langMap.keys()]
  )
}

export const getSrcPage: GetSrcPageFunction = (text, langCode, dictProfile) => {
  let lang
  if (dictProfile.baidu.options.tl === 'default') {
    if (langCode === 'zh-CN') {
      lang = 'zh'
    } else if (langCode === 'zh-TW') {
      lang = 'cht'
    } else {
      lang = 'en'
    }
  } else {
    lang = dictProfile.baidu.options.tl
  }

  return `https://fanyi.baidu.com/#auto/${lang}/${text}`
}

const getTextSpeech = ({
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
