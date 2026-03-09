import type { Language } from '@P/open-trans/languages'
import type { DictItemBase, DictItemOption } from './types/dict-base'

type DictItem<Lang> = DictItemBase & DictItemOption<Lang>


export type ExtractLangFromConfig<Config> = Config extends DictItem<
  infer Lang
>
  ? Lang
  : never


export function machineConfig<Config extends DictItem<Language>> (
  langs: ExtractLangFromConfig<Config>[],
  /** overwrite configs */
  config: Partial<Config>
): DictItem<ExtractLangFromConfig<Config>> {
  const setting: DictItem<ExtractLangFromConfig<Config>> = {
    lang: '11111111',
    selectionLang: {
      english: true,
      chinese: true,
      japanese: true,
      korean: true,
      french: true,
      spanish: true,
      deutsch: true,
      others: true,
      matchAll: false,
    },
    defaultUnfold: {
      english: true,
      chinese: true,
      japanese: true,
      korean: true,
      french: true,
      spanish: true,
      deutsch: true,
      others: true,
      matchAll: false,
    },
    selectionWC: {
      min: 1,
      max: 9999999,
    },
    options: {
      keepLF: 'all',
      slInitial: 'collapse',
      tl: 'default',
      tl2: 'default',
    },
    optionalVall: {
      keepLF: ['none', 'all'],
      slInitial: ['collapse', 'hide', 'full'],
      tl: ['default', ...langs],
      tl2: ['default', ...langs],
    },
    ...config,
  }
  return setting
}
