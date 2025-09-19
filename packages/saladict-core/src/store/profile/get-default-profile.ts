import { v4 as uuid } from 'uuid'
import { MtaAutoUnfold } from './types'
import { AllDicts } from '../../app-config'
import { getAllDicts } from '../../app-config/dicts'


export function getDefaultProfile (id?: string) {
  return {
    version: 1,

    id: id || uuid(),

    /** auto unfold multiline textarea search box */
    mtaAutoUnfold: '' as MtaAutoUnfold,

    /** show waveform control panel */
    waveform: true,

    /** remember user manual dict folding on the same page */
    stickyFold: false,

    dicts: {
      /** default selected dictionaries */
      selected: [
        'bing',
        'cobuild',
        'cambridge',
        'youdao',
        'urban',
        'vocabulary',
        'caiyun',
        'youdaotrans',
        'zdic',
        'guoyu',
        'liangan',
        'googledict'
      ] as Array<keyof AllDicts>,
      // settings of each dict will be auto-generated
      all: getAllDicts()
    }
  }
}
