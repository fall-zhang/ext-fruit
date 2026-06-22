import type { AtomFetchRequest, AtomResponseHandle, SupportLanguage } from '@P/salad-api/src/main'

import { fetch } from '@tauri-apps/plugin-http'

type CombineParam = {
  (text: string, opt: {
    // profile: AllDictsConf
    from: SupportLanguage
    to: SupportLanguage
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
    })).catch(err => {
      console.warn('combine request err: ', err)
    })

    return result
  }
}
