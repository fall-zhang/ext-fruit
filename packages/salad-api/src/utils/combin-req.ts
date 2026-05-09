import { defaultAllDicts } from '../api-trans'
import type { Language } from '../const/languages'
import type { AtomFetchRequest, AtomResponseHandle } from '../types/atom-type'

type CombineParam = {
  (text: string, opt: {
    // profile: AllDictsConf
    from: Language
    to: Language
    // option?: T
  }): void
}

export const combine = (request: AtomFetchRequest, response: AtomResponseHandle): CombineParam => {
  return async (text, opt) => {
    const reqParam = request(text, opt)
    const result = await fetch(reqParam).then(res => response(res, {
      text,
      from: opt.from,
      to: opt.to,
      profile: defaultAllDicts,
    })).catch(err => {
      console.warn('combine request err: ', err)
    })

    return result
  }
}
