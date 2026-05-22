import type { AxiosResponse } from 'axios'
import type { FetchTtsResult } from '../../api-trans/mojidict/type'
import axios from 'axios'

/**
 * 文字转语音生成
 * @param tarId word id
 * @param tarType 102 word, 103 sentence
 */
async function getTTS (
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
  } catch {
    console.error('Failed to fetch TTS')
  }
  return ''
}
function requestPayload (data: object) {
  return JSON.stringify({
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
