export interface FetchWordResult {
  details?: Array<{
    objectId: string
    title: string
    wordId: string
  }>
  examples?: Array<{
    objectId: string
    subdetailsId: string
    title: string
    trans: string
    wordId: string
  }>
  subdetails?: Array<{
    detailsId: string
    objectId: string
    title: string
    wordId: string
  }>
  word?: {
    accent: string
    objectId: string
    pron: string
    spell: string
    tts: string
  }
}

export interface SuggestsResult {
  originalSearchText: string
  searchResults?: Array<{
    objectId: string
    searchText: string
    tarId: string
  }>
  words?: Array<{
    accent: string
    excerpt: string
    objectId: string
    pron: string
    romaji: string
    spell: string
  }>
}

export interface FetchTtsResult {
  result: {
    code: number
    result?: {
      text: string
      url: string
      identity: string
      existed: boolean
      msg: string
    }
  }
}

export interface MojidictWord {
  tarId: string
  spell: string
  pron: string
  tts?: string
}

export interface MojidictDetailExample {
  objectId: string
  title: string
  trans: string
}

export interface MojidictSubdetail {
  objectId: string
  title: string
  examples?: MojidictDetailExample[]
}

export interface MojidictDetail {
  objectId: string
  title: string
  subdetails?: MojidictSubdetail[]
}

export interface MojidictRelated {
  title: string
  excerpt: string
}

export interface MojidictResult {
  word?: MojidictWord
  details?: MojidictDetail[]
  releated?: MojidictRelated[]
}

export type GetTTS = (tarId: string, tarType: 102 | 103) => Promise<string>
