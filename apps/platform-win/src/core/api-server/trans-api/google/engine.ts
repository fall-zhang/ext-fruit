import memoizeOne from 'memoize-one'

import type { GoogleLanguage } from './config'
import { Google } from '@P/open-trans/service-google'
import type { Language } from '@P/open-trans/languages'
import type { GetSrcPageFunction, SearchFunction } from '@/core/api-server/api-common/search-type'
import { type MachineTranslatePayload, getMTArgs } from '../../api-common/get-trans-info'
import type { MachineTranslateResult, machineResult } from '../../api-common/result-handle'

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

export const search: SearchFunction<
  GoogleResult,
  MachineTranslatePayload<GoogleLanguage>
> = async (rawText, opt) => {
  const options = opt.profile.google.options

  const translator = getTranslator()

  const { sl, tl, text } = await getMTArgs(
    translator,
    rawText,
    profile.dicts.all.google,
    config,
    payload
  )

  try {
    const result = await translator.translate(text, sl, tl, {
      token: process.env.GOOGLE_TOKEN || '',
      concurrent: options.concurrent,
      apiAsFallback: true,
    })
    return machineResult(
      {
        result: {
          id: 'google',
          sl: result.from,
          tl: result.to,
          slInitial: profile.dicts.all.google.options.slInitial,
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
