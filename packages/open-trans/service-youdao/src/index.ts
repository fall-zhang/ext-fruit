import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslateError
} from '../../translator'
import sha256 from 'crypto-js/sha256'
import qs from 'qs'

function truncate (q: string): string {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

// https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html#section-12
const langMap: [Language, string][] = [
  ['auto', 'auto'],
  ['en', 'en'],
  ['zh-CN', 'zh-CHS'],
  ['zh-TW', 'zh-CHT'],
  ['ru', 'ru'],
  ['pt', 'pt'],
  ['es', 'es'],
  ['de', 'de'],
  ['ja', 'ja'],
  ['ko', 'ko'],
  ['fr', 'fr'],
  ['ar', 'ar'],
  ['id', 'id'],
  ['vi', 'vi'],
  ['it', 'it']
]

export interface YoudaoConfig {
  appKey: string;
  key: string;
}

interface YoudaoTranslateResult {
  errorCode: string;
  query: string;
  translation: Array<string>;
  l: string;
}

export class Youdao extends Translator<YoudaoConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap)

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  )

  protected async query (
    text: string,
    from: Language,
    to: Language,
    config: YoudaoConfig
  ): Promise<TranslateQueryResult> {
    const salt = new Date().getTime()
    const curTime = Math.round(new Date().getTime() / 1000)
    const str1 = config.appKey + truncate(text) + salt + curTime + config.key
    const sign = sha256(str1)
    const res = await this.request<YoudaoTranslateResult>({
      url: 'https://openapi.youdao.com/api',
      method: 'post',
      data: qs.stringify({
        q: text,
        appKey: config.appKey,
        salt,
        from: Youdao.langMap.get(from),
        to: Youdao.langMap.get(to),
        sign,
        signType: 'v3',
        curtime: curTime,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }).catch(() => {
      throw new TranslateError('NETWORK_ERROR')
    })

    // https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html
    if (res.data.errorCode) {
      switch (res.data.errorCode) {
      case '0':
        break // means success
      case '101': // params error
      case '108':
        throw new TranslateError('AUTH_ERROR', res.data.errorCode)
      case '401':
        throw new TranslateError('USEAGE_LIMIT', res.data.errorCode)
      default:
        throw new TranslateError('UNKNOWN', res.data.errorCode)
      }
    }

    const result = res.data
    return {
      text,
      from,
      to,
      origin: {
        paragraphs: text.split(/\n+/),
        tts: (await this.textToSpeech(text, from)) || undefined
      },
      trans: {
        paragraphs: result.translation,
        tts:
          (await this.textToSpeech(result.translation.join('\n'), to)) ||
          undefined
      }
    }
  }

  readonly name = 'youdao'

  getSupportLanguages (): Language[] {
    return [...Youdao.langMap.keys()]
  }

  async textToSpeech (text: string, lang: Language): Promise<string | null> {
    const standard2custom: { [prop: string]: string | null } = {
      en: 'eng',
      ja: 'jap',
      ko: 'ko',
      fr: 'fr'
    }
    const voiceLang = standard2custom[lang]
    if (!voiceLang) return null

    // you better use official api or offical tts url returned by translator result
    return (
      'https://dict.youdao.com/dictvoice?' +
      qs.stringify({
        audio: text,
        type: 0,
        le: voiceLang,
        keyfrom: 'speaker-target'
      })
    )
  }
}

export default Youdao
