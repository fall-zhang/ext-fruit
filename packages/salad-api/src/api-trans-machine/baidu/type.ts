import type { SupportLanguage } from '../../main'

/**
 * official doc: https://fanyi-api.baidu.com/doc/23
 */
export type BaiduTranslateResult = {
  from: string;
  to: string;
  trans_result: Array<{
    // 翻译
    dst: string;
    // 原文
    src: string;
  }>;
  lan?: SupportLanguage;
}
export type BaiduTranslateError = {
  error_code: '54001' | string;
  error_msg: 'Invalid Sign' | string;
}
