import { isContainEnglish } from '@/core/api-server/utils/lang-check'
import { invoke } from '@tauri-apps/api/core'

interface Suggest {
  entry: string
  explain: string
}

/**
 * 获取当前单词的关联单词
 * @param text
 * @returns
 */
export async function getSuggests (text: string): Promise<Suggest[]> {
  const lang = isContainEnglish(text)
  if (!lang) {
    return []
  }
  try {
    return await Promise.any([getYoudaoSuggest(text)])
  } catch (err) {
    console.warn('⚡️ line:16 ~ err: ', err)
    return []
  }
}

// async function getCibaSuggest (text: string): Promise<Suggest[]> {
//   invoke('suggest_req', {
//     url: 'http://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=10&client=6&uid=0&is_need_mean=1&word=' +
//     encodeURIComponent(text),
//   })
// }
async function getYoudaoSuggest (text: string): Promise<Suggest[]> {
  if (text === '') {
    return []
  }
  const youdaoSuggest = await invoke('suggest_req', {
    url: 'https://dict.youdao.com/suggest?doctype=json&le=en&ver=2.0&q=' + encodeURIComponent(text),
  }) as string
  try {
    const json = JSON.parse(youdaoSuggest)
    if (json && json.data && Array.isArray(json.data.entries)) {
      return json.data.entries.filter((x: any) => x && x.explain && x.entry)
    }
    throw new Error('cannot get correct suggest')
  } catch (err) {
    console.warn(err)
    return []
  }
}
