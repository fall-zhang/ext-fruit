export interface Word {
  /** primary key, milliseconds elapsed since the UNIX epoch */
  date: number
  /** word text */
  text: string
  /** the sentence where the text string is located */
  context: string
  /** page title */
  title: string
  /** page url */
  url: string
  /** favicon url */
  favicon: string
  /** translation */
  trans: string
  /** custom note */
  note: string
}

export interface WordSelection {
  word: Word | null
  mouseX: number
  mouseY: number
  dbClick: boolean
  altKey: boolean
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  /** inside panel? */
  self: boolean
  /** skip salad bowl and show panel directly */
  instant: boolean
  /** force panel to skip reconciling position */
  force: boolean
}
