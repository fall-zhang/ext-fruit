import React from 'react'

export const ChangeEntryContext = React.createContext<(entry: string) => void>(
  (entry: string) => {
    console.warn('method not implement, entry:', entry)
  }
)
