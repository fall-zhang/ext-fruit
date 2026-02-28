import type { DictID, AppConfig, AppConfigMutable } from '@P/saladict-core/src/app-config'
import type { Language } from '@P/open-trans/languages'
import type { DictItem, SelectOptions } from '@P/saladict-core/src/app-config/dicts'
import type { DictSearchResult } from '@P/api-server/types'
// import { isContainJapanese, isContainKorean } from '@/_helpers/lang-check'
export interface MachineTranslatePayload<Lang = string> {
  sl?: Lang
  tl?: Lang
}

export interface MachineTranslateResult<ID extends DictID> {
  id: ID
  slInitial: 'hide' | 'collapse' | 'full'
  /** Source language */
  sl: Language
  /** Target language */
  tl: Language
  searchText: {
    paragraphs: string[]
    tts?: string
  }
  trans: {
    paragraphs: string[]
    tts?: string
  }
  requireCredential?: boolean
}

type DefaultMachineOptions<Lang extends Language> = {
  /** Keep linebreaks */
  keepLF: 'none' | 'all'
  /** Source language initial state */
  slInitial: 'hide' | 'collapse' | 'full'
  tl: 'default' | Lang
  tl2: 'default' | Lang
}

export type MachineDictItem<
  Lang extends Language,
  Options extends { [option: string]: number | boolean | string } = Record<string, boolean>
> = DictItem<Options & DefaultMachineOptions<Lang>>

export type ExtractLangFromConfig<Config> = Config extends MachineDictItem<infer Lang>
  ? Lang
  : never

/** Generate catalog */
export function machineResult<ID extends DictID> (
  data: DictSearchResult<MachineTranslateResult<ID>>,
  langcodes: Array<string>
): DictSearchResult<MachineTranslateResult<ID>> {
  const langCodesOptions = [
    {
      value: 'auto',
      label: '%t(content:machineTrans.auto)',
    },
  ]
  for (const lang of langcodes) {
    langCodesOptions.push({
      value: lang,
      label: `${lang} %t(langcode:${lang})`,
    })
  }

  const catalog: DictSearchResult<MachineTranslateResult<ID>>['catalog'] = [
    {
      key: 'sl',
      value: data.result.sl,
      title: '%t(content:machineTrans.sl)',
      options: langCodesOptions,
    },
    {
      key: 'tl',
      value: data.result.tl,
      title: '%t(content:machineTrans.tl)',
      options: langCodesOptions,
    },
    {
      key: 'copySrc',
      value: 'copySrc',
      label: '%t(content:machineTrans.copySrc)',
    },
    {
      key: 'copyTrans',
      value: 'copyTrans',
      label: '%t(content:machineTrans.copyTrans)',
    },
  ]

  if (data.result.slInitial === 'hide') {
    catalog.push({
      key: 'showSl',
      value: '',
      label: '%t(content:machineTrans.showSl)',
    })
  }

  return {
    ...data,
    catalog,
  }
}
