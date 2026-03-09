import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { Word } from '../types/word'
import { isInNotebook, saveWord } from '../core/database'
import { newWord } from '../dict-utils/new-word'
// 外部系统提供的 context
interface OptContextType {
  navigate(path:string):void
  openURL(path:string):void
  openExternalURL(path:string):void
  /**
   * Add the latest history item to Notebook
   * @returns {boolean} if success return true
  */
  addToNoteBook(word:Word):Promise<boolean>
  /** Is current word in Notebook */
  isInNotebook(word:string):Promise<boolean>
}
// 默认
const OptContext = createContext<OptContextType>({
  navigate (path: string) {
    throw new Error('navigate Function not implemented.')
  },
  openURL (path: string) {
    window.open(path, '_blank')
  },
  openExternalURL (path: string) {
    // 即将打开外部链接，是否跳转
    throw new Error('Function not implemented.')
  },
  async addToNoteBook (word) {
    console.log('save word to index DB')
    const saveState = await saveWord({
      area: 'notebook',
      word,
    })
    console.log('⚡️ line:37 ~ saveState: ', saveState)
    return saveState === 1
  },
  isInNotebook (word) {
    return isInNotebook(newWord({ text: word }))
  },
})

export function useOptContext () {
  const context = useContext(OptContext)
  return context
}

interface CalendarProviderProps extends OptContextType {
  children: ReactNode;
}

export function OptProvider ({ children, ...props }: CalendarProviderProps) {
  return (
    <OptContext.Provider value={props}>
      {children}
    </OptContext.Provider>
  )
}

