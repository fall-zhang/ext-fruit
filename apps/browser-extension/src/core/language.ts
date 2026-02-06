const langUI = browser.i18n.getUILanguage()
export type LangCode = 'zh-CN' | 'zh-TW' | 'en'

let langCode: LangCode
if (langUI === 'zh-CN') {
  langCode = 'zh-CN'
} else if (langUI === 'zh-TW' || langUI === 'zh-HK') {
  langCode = 'zh-TW'
} else {
  langCode = 'en'
}

