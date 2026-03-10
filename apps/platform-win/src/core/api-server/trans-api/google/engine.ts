import memoizeOne from 'memoize-one'
import type {
  MachineTranslateResult,
  MachineTranslatePayload
} from '@/components/MachineTrans/engine'
import {
  getMTArgs,
  machineResult
} from '@/components/MachineTrans/engine'
import type { GoogleLanguage } from './config'
import { Google } from '@P/open-trans/service-google'
import type { Language } from '@P/open-trans/languages'
import type { GetSrcPageFunction } from '@/core/api-server/api-common/atom-type'
import type { SearchFunction } from '@/core/api-server/api-common/search-type'

export const getTranslator = memoizeOne(() => new Google({ env: 'ext' }))

export const getSrcPage: GetSrcPageFunction = (text, langCode, profile) => {
  const domain = 'com'
  const lang =
    profile.google.options.tl === 'default'
      ? langCode
      : profile.google.options.tl

  return `https://translate.google.${domain}/#auto/${lang}/${text}`
}

export type GoogleResult = MachineTranslateResult<'google'>

export const search: SearchFunction<
  GoogleResult,
  MachineTranslatePayload<GoogleLanguage>
> = async (rawText, config, profile, payload) => {
  const options = profile.dicts.all.google.options

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
