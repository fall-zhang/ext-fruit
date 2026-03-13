import type { GetSrcPageFunction } from '../../api-common/search-type'

export const getSrcPage: GetSrcPageFunction = (text, langCode, dictProfile) => {
  let lang
  if (dictProfile.baidu.options.tl === 'default') {
    if (langCode === 'zh-CN') {
      lang = 'zh'
    } else if (langCode === 'zh-TW') {
      lang = 'cht'
    } else {
      lang = 'en'
    }
  } else {
    lang = dictProfile.baidu.options.tl
  }

  return `https://fanyi.baidu.com/#auto/${lang}/${text}`
}

// 当前 API 的源，用于 tauri 的
export const apiOrigin = 'https://api.fanyi.baidu.com'
