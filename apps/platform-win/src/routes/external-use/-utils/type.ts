import type { ArrayValues } from 'type-fest'

const languages = [
  'chinese',
  'english',
  'japanese',
  'korean',
  'french',
  'spanish',
  'deutsch',
] as const

type Languages = ArrayValues<typeof languages>

export type SupportedLangs = {
  [key in Languages | 'others' | 'matchAll']: boolean
}
