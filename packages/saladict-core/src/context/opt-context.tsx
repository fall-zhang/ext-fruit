import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
// 外部系统提供的 context
interface OptContextType {
  navigate(path:string):void
  openURL(path:string):void
  openExternalURL(path:string):void
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
