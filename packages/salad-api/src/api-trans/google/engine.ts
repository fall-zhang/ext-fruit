import memoizeOne from 'memoize-one'

import { Google } from '@P/open-trans/service-google'
import type { Language } from '@P/open-trans/languages'
import type { GetSrcPageFunction, SearchFunction } from '@/core/api-server/api-common/search-type'
import { machineResult, type MachineTranslateResult } from '../../api-common/result-handle'
import { detectLangInfo } from '../../api-common/detect-lang'

export const getTranslator = memoizeOne(() => new Google())

export const getSrcPage: GetSrcPageFunction = (text, langCode, profile) => {
  const domain = 'com'
  const lang =
    profile.google.options.tl === 'default'
      ? langCode
      : profile.google.options.tl

  return `https://translate.google.${domain}/#auto/${lang}/${text}`
}

export type GoogleResult = MachineTranslateResult

export const search: SearchFunction<GoogleResult> = async (rawText, opt) => {
  const options = opt.profile.google.options

  const translator = getTranslator()

  const { from: sl, to: tl, text } = detectLangInfo(
    rawText,
    {
      from: opt.from,
      to: opt.to,
      localLang: opt.localLang,
    }
  )

  try {
    const result = await translator.translate(text, sl, tl, {
      concurrent: options.concurrent,
      apiAsFallback: true,
      order: [],
    })
    return machineResult(
      {
        result: {
          id: 'google',
          sl: result.from,
          tl: result.to,
          slInitial: opt.profile.google.options.slInitial,
          searchText: result.origin,
          trans: result.trans,
        },
        audio: {
          py: result.trans.tts,
          us: result.trans.tts,
        },
      },
      translator.getSupportLanguages()
    )
  } catch (e) {
    return machineResult(
      {
        result: {
          id: 'google',
          sl,
          tl,
          slInitial: 'hide',
          searchText: { paragraphs: [''] },
          trans: { paragraphs: [''] },
        },
      },
      translator.getSupportLanguages()
    )
  }
}

export async function getTTS (text: string, lang: Language): Promise<string> {
  return (await getTranslator().textToSpeech(text, lang)) || ''
}
