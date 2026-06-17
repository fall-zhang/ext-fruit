import type { AppProfile } from '@/config/trans-profile'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { getDefaultSelectDict } from '@/config/trans-profile'
import { SearchContext } from './context'
import { getLocalHistory, updateHistory } from '@/core/local-store/history-store'
import type { HistoryWord, Word } from '@/types/word'
import type { DictSearchState, WordSearch } from './context'
import type { AsyncOptRes } from '@/core/file-system/types'
import { isInNotebook } from '@/core/local-db'
// import { api } from '@/core/api-server/trans-api'
import type { DictID } from '@P/salad-api/src/api-trans'
import * as api from '@P/salad-api/src/api-trans/api-all'
import { fetch } from '@tauri-apps/plugin-http'
import type { RenderDictItem } from './utils/get-search-dict'
import { getSearchInfo } from './utils/get-search-info'

export function SearchProvider ({ children, profile }: {
  children: ReactNode
  profile: AppProfile
}) {
  const [text, setText] = useState('')
  const activeProfile = profile
  const [searchHistory, setSearchHistory] = useState<HistoryWord[]>([])
  const [isInNote, setIsInNote] = useState<boolean>(false)
  const [renderedDicts, setRenderDicts] = useState<RenderDictItem[]>([])
  const selectedDicts = getDefaultSelectDict()
  const userFoldedDicts = useRef<Partial<Record<DictID, boolean>>>({})
  async function clearHistory (): AsyncOptRes {
    await updateHistory([])
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
    const renderDictList: RenderDictItem[] = []
    let word: Word
    if (searchOpt && searchOpt.word) {
      word = searchOpt.word
    } else {
      // 默认为最后一次查找
      word = searchHistory[0]
    }
    const transInfo = getSearchInfo(word, { localLang: 'zh' })
    // 获取需要渲染的 dict
    if (searchOpt.dictId) {
      const isEnableDict = selectedDicts.some(item => item === searchOpt.dictId)

      const requestConf = activeProfile.allDicts[searchOpt.dictId]

      const toLang = transInfo.to.find(item => requestConf.to.includes(item))

      if (isEnableDict && toLang) {
        renderDictList.push({
          dictID: searchOpt.dictId,
          searchStatus: 'SEARCHING',
          from: transInfo.from,
          to: toLang,
        })
      }
    } else {
      selectedDicts.forEach(id => {
        const dictConf = activeProfile.allDicts[id]

        const isWordCount = transInfo.wordCount >= dictConf.minWord && transInfo.wordCount <= dictConf.maxWord
        const isSupportLang = dictConf.from.includes(transInfo.from)

        const requestConf = activeProfile.allDicts[id]

        const toLang = transInfo.to.find(item => requestConf.to.includes(item))
        if (isWordCount && isSupportLang && toLang) {
          if (userFoldedDicts.current[id]) {
            renderDictList.push({
              dictID: id,
              searchStatus: 'IDLE',
              from: transInfo.from,
              to: toLang,
            })
          } else {
            renderDictList.push({
              dictID: id,
              searchStatus: 'SEARCHING',
              from: transInfo.from,
              to: toLang,
            })
          }
        }
      })
      console.log('search dicts', renderDictList)
    }
    setRenderDicts(renderDictList)
    // searching
    renderDictList.forEach((item) => {
      const id: DictID = item.dictID
      const requestApi = api[id]
      const requestConf = activeProfile.allDicts[id]
      if (id === 'google') {
        activeProfile.dictAuth
        return
      }
      const toLang = transInfo.to.find(item => requestConf.to.includes(item))
      if (!toLang) {
        return
      }

      const request: Request = requestApi.getRequest(word.text, {
        from: transInfo.from,
        to: toLang,
      })
      fetch(request).then(res => {
        return requestApi.handleResponse(res, {
          from: item.from,
          to: item.to,
          text,
        })
      }).then(res => {
        const dictResult: RenderDictItem = {
          dictID: id,
          searchStatus: 'FINISH',
          searchResult: res,
          from: item.from,
          to: item.to,
        }
        setRenderDicts(oldDict => {
          return oldDict.map(oldItem => {
            if (oldItem.dictID === dictResult.dictID) {
              return dictResult
            }
            return oldItem
          })
        })
      })
        .catch(err => console.warn('request err: ', err))
    })
    isInNotebook(word).then(res => {
      if (!word) {
        console.warn('SEARCH_START: Empty word on first search', searchOpt)
        return
      }
      setIsInNote(res)
    }).catch(err => {
      console.error('⚡️ line:145 ~ err: ', err)
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
        isInNotebook: isInNote,
        activeProfile,
        selectedDicts,
        renderedDicts,
        searchHistory,
        userFoldedDicts: userFoldedDicts.current,
        removeHistoryItem,
        searchStart,
        clearHistory,
      } satisfies DictSearchState }>
      {children}
    </SearchContext.Provider>
  )
}
