import { Word } from '../../store/selection/types'
import {
  saveWord as _saveWord,
  saveWords as _saveWords,
  deleteWords as _deleteWords
} from './write'

export { isInNotebook, getWordsByText, getWords } from './read'

// prevent circular dependencies

/** Save a word to Notebook or History */
export const saveWord: typeof _saveWord = options => {
  if (options.area === 'notebook' && options.word) {
    syncServiceUpload({
      action: 'ADD',
      words: [options.word]
    })
  }
  return _saveWord(options)
}

export const saveWords: typeof _saveWords = options => {
  if (options.area === 'notebook' && options.words.length > 0) {
    syncServiceUpload({
      action: 'ADD',
      words: options.words
    })
  }
  return _saveWords(options)
}

export const deleteWords: typeof _deleteWords = options => {
  if (options.area === 'notebook') {
    syncServiceUpload({
      action: 'DELETE',
      dates: options.dates
    })
  }
  return _deleteWords(options)
}

type OptionProp = {
  action: 'ADD'
  words?: Word[]
  force?: boolean
} |
    {
      action: 'DELETE'
      dates?: number[]
      force?: boolean
    }

async function syncServiceUpload (
  options:OptionProp
) {

}
