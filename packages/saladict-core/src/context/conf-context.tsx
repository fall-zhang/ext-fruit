import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import type { Profile } from '../app-config/profiles'
import type { AppConfig } from '../app-config'
import { getSyncConfig } from '../core/sync-manager/helpers'

interface CalendarContextType {
  config:AppConfig
  profile:Profile
  // Date management
  // appDisable: boolean;
  onUpdateConfig():void
  onUpdateProfile():void
  // // Etiquette visibility management
  // visibleColors: string[];
  // toggleColorVisibility: (color: string) => void;
  // isColorVisible: (color: string | undefined) => boolean;
}

const ConfContext = createContext<CalendarContextType >({
  config:getSyncConfig
})

export function useConfContext () {
  const context = useContext(ConfContext)
  if (context === undefined) {
    console.log('you are using original conf context')

    // throw new Error(
    //   'useConfContext must be used within a ConfProvider'
    // )
  }
  return context
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function ConfProvider ({ children }: CalendarProviderProps) {
  // Initialize visibleColors based on the isActive property in etiquettes
  const [visibleColors, setVisibleColors] = useState<string[]>([])

  // Toggle visibility of a color
  const toggleColorVisibility = (color: string) => {
    setVisibleColors([])
  }

  // Check if a color is visible
  const isColorVisible = (color: string | undefined) => {
    if (!color) return true // Events without a color are always visible
    return visibleColors.includes(color)
  }

  const value:CalendarContextType = {
    appDisable: false,
    visibleColors,
    toggleColorVisibility,
    isColorVisible,
  }

  return (
    <ConfContext.Provider value={value}>
      {children}
    </ConfContext.Provider>
  )
}
