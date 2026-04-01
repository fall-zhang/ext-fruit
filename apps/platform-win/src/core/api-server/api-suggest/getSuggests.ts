import { fetch } from '@tauri-apps/plugin-http'
import { countWords } from '../utils/get-word-count'
import { detectLang } from '@P/open-trans/utils/detect-lang'

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
  if (countWords(text) > 1) {
    return []
  } else if (detectLang(text)) {

  }
  try {
    return await Promise.any([getCiba(text), getYoudao(text)])
  } catch (err) {
    console.warn('⚡️ line:16 ~ err: ', err)
    return []
  }
}

/** 金山词霸 */
async function getCiba (text: string): Promise<Suggest[]> {
  console.log('⚡️ line:1111 ~ text: ')
  const res = await fetch(
    'http://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=10&client=6&uid=0&is_need_mean=1&word=' +
    encodeURIComponent(text)
  )
  const json = await res.json()
  if (json && Array.isArray(json.message)) {
    return json.message
      .filter((x: any) => x && x.key)
      .map((x: any) => ({
        entry: x.key,
        explain: Array.isArray(x.means) && x.means.length > 0
          ? x.means[0].part + ' ' + x.means[0].means.join(' ')
          : '',
      }))
  }
  if (import.meta.env.VITE_DEBUG) {
    console.warn('fetch suggests failed', text, json)
  }
  throw new Error()
}

async function getYoudao (text: string): Promise<Suggest[]> {
  const r = await fetch(
    'https://dict.youdao.com/suggest?doctype=json&le=en&ver=2.0&q=' +
    encodeURIComponent(text)
  )
  const json = await r.json()
  if (json && json.data && Array.isArray(json.data.entries)) {
    return json.data.entries.filter((x: any) => x && x.explain && x.entry)
  }
  if (import.meta.env.VITE_DEBUG) {
    console.warn('fetch suggests failed', text, json)
  }
  throw new Error()
}
