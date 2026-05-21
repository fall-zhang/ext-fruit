
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { SuggestsResult, FetchTtsResult } from './type'
import { handleNetWorkError, handleNoResult } from '../../utils/error-response'

/**
 * 文字转语音生成
 * @param tarId word id
 * @param tarType 102 word, 103 sentence
 */
export async function getTTS (
  tarId: string,
  tarType: 102 | 103
): Promise<string> {
  try {
    const { data }: AxiosResponse<FetchTtsResult> = await axios({
      method: 'post',
      url: 'https://api.mojidict.com/parse/functions/fetchTts_v2',
      headers: {
        'content-type': 'text/plain',
      },
      data: requestPayload({ tarId, tarType }),
    })

    return data.result?.result?.url || ''
  } catch (e) {
    console.error(e)
  }
  return ''
}

export function requestPayload (data: object) {
  return JSON.stringify({
    // _ApplicationId: process.env.VITE_MOJI_ID,
    _ClientVersion: 'js2.12.0',
    _InstallationId: getInstallationId(),
    ...data,
  })
}

function getInstallationId () {
  return s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s()
}

function s () {
  return Math.floor(65536 * (1 + Math.random()))
    .toString(16)
    .substring(1)
}
/**
 * 获取对应单词的 id
 * @returns
 */
export async function getSuggests (text: string): Promise<SuggestsResult> {
  try {
    const {
      data: { result },
    }: AxiosResponse<{ result?: SuggestsResult }> = await axios({
      method: 'post',
      url: 'https://api.mojidict.com/parse/functions/search_v3',
      headers: {
        'content-type': 'text/plain',
      },
      data: requestPayload({
        langEnv: 'zh-CN_ja',
        needWords: true,
        searchText: text,
      }),
    })

    return result || handleNoResult()
  } catch (e) {
    return handleNetWorkError(e)
  }
}
