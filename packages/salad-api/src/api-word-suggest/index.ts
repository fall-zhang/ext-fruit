interface Suggest {
  entry: string
  explain: string
}
/** 金山词霸 */
async function getCibaRequest (text: string): Promise<Suggest[]> {
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

async function getYoudaoRequest (text: string): Promise<Suggest[]> {
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
