export interface Meaning {
  explaining?: string
  examples?: string[]
}

export type MeaningGroup = Meaning[]

export interface Section {
  // could be transitive or intranstive if pos was verb
  title?: string
  meaningGroups: MeaningGroup[]
}

export interface Phonetic {
  symbol?: string
  audio?: string
}

export interface Pronunciation {
  syllable?: string
  phonetics: Phonetic[]
}

export interface Group {
  title?: string
  pos?: string
  pr?: Pronunciation
  conjugation?: string
  sections: Section[]
  forms?: string[]
}

export interface MerriamWebsterResultV2 {
  groups: Group[]
  synonyms?: Array<[string, string[]]>
  etymology?: Array<[string, string]>
}
