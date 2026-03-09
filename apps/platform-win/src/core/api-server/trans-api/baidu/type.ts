import type { Language } from '@P/open-trans/languages'

export type BaiduTranslateResult = {
  from: string;
  to: string;
  trans_result: Array<{
    dst: string;
    src: string;
  }>;
  lan?: Language;
}
export type BaiduTranslateError = {
  error_code: '54001' | string;
  error_msg: 'Invalid Sign' | string;
}
