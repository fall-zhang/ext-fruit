import type { SupportedLangs } from './type'
import memoizeOne from 'memoize-one'
import type { ArrayValues } from 'type-fest'
import { matchers, matcherSign } from './reg-utils'
import { isContainChinese, isContainDeutsch, isContainEnglish, isContainFrench, isContainJapanese, isContainKorean, isContainSpanish } from '@P/salad-api/src/utils/detect-lang'
const languages = [
  'chinese',
  'english',
  'japanese',
  'korean',
  'french',
  'spanish',
  'deutsch',
] as const
type Languages = ArrayValues<typeof languages>

const isContain: { [key in Languages]: (text: string) => boolean } = {
  chinese: memoizeOne(isContainChinese),
  english: memoizeOne(isContainEnglish),
  /** Hiragana & Katakana, no Chinese */
  japanese: memoizeOne(isContainJapanese),
  /** Korean Hangul, no Chinese */
  korean: memoizeOne(isContainKorean),
  /** French, no English àâäèéêëîïôœùûüÿç */
  french: memoizeOne(isContainFrench),
  /** Spanish, no English áéíóúñü¡¿ */
  spanish: memoizeOne(isContainSpanish),
  /** Deutsch, no English äöüÄÖÜß */
  deutsch: memoizeOne(isContainDeutsch),
}


const matchAllMeaningless = new RegExp(`^(\\d|\\s|${matcherSign.source})+$`)


export function checkSupportedLangs (
  langs: SupportedLangs,
  text: string
): boolean {
  if (!text) {
    return false
  }

  if (langs.matchAll) {
    if (matchAllMeaningless.test(text)) {
      return false
    }

    if (langs.others) {
      const checkedMatchers: RegExp[] = [/-|\.|\d|\s/]
      const uncheckedMatchers: RegExp[] = []

      for (let i = languages.length - 1; i >= 0; i--) {
        const l = languages[i]
        if (langs[l]) {
          checkedMatchers.push(matchers[l])
        } else {
          uncheckedMatchers.push(matchers[l])
        }
      }

      for (let i = 0; i < text.length; i++) {
        // characters of latin languages may overlap
        if (
          checkedMatchers.every(m => !m.test(text[i])) &&
          uncheckedMatchers.some(m => m.test(text[i]))
        ) {
          return false
        }
      }
      return true
    }
    const checkedMatchers = languages
      .filter(l => langs[l])
      .map(l => matchers[l])

    checkedMatchers.push(/-|\.|\d|\s/)

    for (let i = text.length - 1; i >= 0; i--) {
      if (checkedMatchers.every(m => !m.test(text[i]))) {
        return false
      }
    }
    return true
  } /* !langs.matchAll */
  if (languages.some(l => langs[l] && isContain[l](text))) {
    return true
  }

  if (!langs.others || matchAllMeaningless.test(text)) {
    return false
  }

  const uncheckedMatchers = languages
    .filter(l => !langs[l])
    .map(l => matchers[l])

  uncheckedMatchers.push(new RegExp(`${matcherSign.source}|\\d|\\s`))

  for (let i = text.length - 1; i >= 0; i--) {
    if (uncheckedMatchers.every(m => !m.test(text[i]))) {
      return true
    }
  }
  return false
}
