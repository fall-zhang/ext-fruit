import type { Language } from '@P/open-trans/languages'
import type { DictID } from '../types/all-dict-conf'
import type { DictSearchResult } from './search-type'

export interface MachineTranslateResult {
  id: DictID
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


/** Generate catalog 生成目录 */
export function machineResult (
  data: DictSearchResult<MachineTranslateResult>,
  langcodes: Array<string>
): DictSearchResult<MachineTranslateResult> {
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

  const catalog: DictSearchResult['catalog'] = [
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
