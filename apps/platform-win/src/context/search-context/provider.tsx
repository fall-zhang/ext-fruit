import type { AppProfile } from '@/config/trans-profile'
import type { DictSearchResult, SearchFunction } from '@/core/api-server/api-common/search-type'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { getDefaultSelectDict } from '@/config/trans-profile'
import { SearchContext } from './context'
import { getLocalHistory, updateHistory } from '@/core/local-store/history-store'
import type { HistoryWord, Word } from '@/types/word'
import type { DictSearchState, WordSearch } from './context'
import { checkSupportedLangs } from '@/core/api-server/utils/lang-check'
import { countWords } from '@/core/api-server/utils/get-word-count'
import type { AsyncOptRes } from '@/core/file-system/types'
import { isInNotebook } from '@/core/local-db'
// import { api } from '@/core/api-server/trans-api'
import type { DictID } from '@P/salad-api/src/api-trans'
import * as api from '@P/salad-api/src/api-trans/api-all'
import { combine } from '@/core/api-server/tauri-combine'
import { fetch } from '@tauri-apps/plugin-http'

type RenderDictItem = {
  readonly dictID: DictID
  // idle 闲置
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}

export function SearchProvider ({ children, profile }: {
  children: ReactNode
  profile: AppProfile
}) {
  const [text, setText] = useState('')
  const activeProfile = profile
  const [searchHistory, setSearchHistory] = useState<HistoryWord[]>([])
  const [renderedDicts, setRenderDicts] = useState<RenderDictItem[]>([])
  const selectedDicts = getDefaultSelectDict()
  const userFoldedDicts = useRef<Partial<Record<DictID, boolean>>>({})
  async function clearHistory (): AsyncOptRes {
    updateHistory([])
    setSearchHistory([])
    return {
      state: 'success',
      msg: '更新内容成功',
      data: null,
    }
  }
  function removeHistoryItem (id: string) {
    const newHistory = searchHistory.filter(item => item.id !== id)
    updateHistory(newHistory).then(res => {
      setSearchHistory(newHistory)
    }).catch(err => {
      console.warn(' update history error: ', err)
    })
  }
  const searchStart: WordSearch = (searchOpt) => {
    let dictList: RenderDictItem[] = []
    let word: Word
    // const { activeProfile, searchHistory, selectedDicts, renderedDicts, userFoldedDicts } = get()
    if (searchOpt && searchOpt.word) {
      word = searchOpt.word
    } else {
      // 默认为最后一次查找
      word = searchHistory[0]
    }

    if (searchOpt && searchOpt.id) {
      const searchDicts = renderedDicts.filter(item => item.dictID === searchOpt.id)
      dictList = searchDicts.map(d => {
        return {
          dictID: d.dictID,
          searchStatus: 'SEARCHING',
          searchResult: null,
        }
      })
    } else {
      // dicts that should be rendered
      dictList = selectedDicts.filter(id => {
        const dict = activeProfile.allDicts[id]
        if (checkSupportedLangs(dict.from, word.text)) {
          const wordCount = countWords(word.text)
          const max = dict.maxWord
          const min = dict.minWord
          return wordCount >= min && wordCount <= max
        }
        return false
      })
        .map(id => {
          // fold or unfold
          const status = checkSupportedLangs(
            activeProfile.allDicts[id],
            word.text
          ) && (!userFoldedDicts[id])
            ? 'SEARCHING'
            : 'IDLE'
          return {
            dictID: id,
            searchStatus: status,
            searchResult: null,
          }
        })
      console.log('search dicts', dictList)
    }
    isInNotebook(word).then(isInNote => {
      // res
      if (!word) {
        console.warn('SEARCH_START: Empty word on first search', searchOpt)
        return
      }
      let newHistory: HistoryWord[]
      if (searchOpt.noHistory) {
        newHistory = searchHistory
      } else {
        newHistory = [{
          ...word,
          isInNotebook: isInNote,
        }, ...searchHistory]
        updateHistory(newHistory)
      }
      return {
        text: word.text,
        searchHistory: newHistory,
        renderedDicts: dictList,
      }
    }).catch(err => {
      console.error('⚡️ line:145 ~ err: ', err)
    })
    // start search

    // searching
    // console.log('⚡️ line:157 ~ selectedDicts: ', selectedDicts)
    dictList.forEach((item) => {
      const id: DictID = item.dictID
      const requestApi = api[id]
      // const request:Request = requestApi.getRequest(word.text)
      // const searchFunc: SearchFunction = combine(, requestApi.handleResponse)
      searchFunc(word.text, {
        profile: activeProfile.allDicts,
        dictAuth: activeProfile.dictAuth,
        localLang: 'zh-CN',
      }).then((res: DictSearchResult) => {
        const dictResult: RenderDictItem = {
          dictID: id,
          searchStatus: 'FINISH',
          searchResult: res.result,
        }

        setRenderDicts(oldVal => {
          const newDict = renderedDicts.map(item => {
            if (item.dictID === id) {
              return dictResult
            }
            return item
          })
          return newDict
        })
      }).catch((err: unknown) => {
        console.warn(`current dict ${id} ~ err: `, err)
        const newDict = renderedDicts.map(item => {
          if (item.dictID === id) {
            return {
              searchStatus: 'IDLE',
              dictID: id,
              searchResult: null,
            } satisfies RenderDictItem
          }
          return item
        })
        setRenderDicts(newDict)
      })
    })
  }
  // 从本地获取历史记录
  useEffect(() => {
    let abortState = false
    getLocalHistory().then(res => {
      if (abortState) {
        return
      }
      setSearchHistory(res)
    }).catch(err => {
      console.log('Get history from local err: ', err)
    })
    return () => {
      abortState = true
    }
  }, [])
  return (
    <SearchContext.Provider
      value={{
        text,
        activeProfile,
        selectedDicts,
        renderedDicts,
        searchHistory,
        userFoldedDicts,
        removeHistoryItem,
        searchStart,
        clearHistory,
      } satisfies DictSearchState }>
      {children}
    </SearchContext.Provider>
  )
}
