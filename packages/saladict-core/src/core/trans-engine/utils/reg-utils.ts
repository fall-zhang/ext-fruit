
/**
 * 匹配标点符号
 */
export const matcherSign = /[/[\]{}$^*+|?.\-~!@#%&()_='";:><,。？！，、；：“”﹃﹄「」﹁﹂‘’『』（）—［］〔〕【】…－～·‧《》〈〉﹏＿]/

/**
 * 匹配对应语言
 */
export const matchers = {
  chinese: /[\u4e00-\u9fa5]/,
  english: /[a-zA-Z]/,
  /** Hiragana & Katakana, no Chinese */
  japanese: /[\u3041-\u3096\u30A0-\u30FF]/,
  /** Korean Hangul, no Chinese */
  korean: /[\u3131-\u4dff\u9fa6-\uD79D]/,
  /** French, no English àâäèéêëîïôœùûüÿç */
  french: /[\u00e0\u00e2\u00e4\u00e8\u00e9\u00ea\u00eb\u00ee\u00ef\u00f4\u0153\u00f9\u00fb\u00fc\u00ff\u00e7]/i,
  /** Spanish, no English áéíóúñü¡¿ */
  spanish: /[\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc\u00a1\u00bf]/i,
  /** Deutsch, no English äöüÄÖÜß */
  deutsch: /[\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\u00df]/i,
} as const
