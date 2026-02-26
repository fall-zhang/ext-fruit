import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { getDefaultProfile, type Profile } from '../app-config/profiles'
import { getDefaultConfig, type AppConfig } from '../app-config'

interface ConfContextType {
  config:AppConfig
  profile:Profile
  // Date management
  // appDisable: boolean;
  updateConfig(config:AppConfig):void
  updateProfile(profile:Profile):void
  // // Etiquette visibility management
  // visibleColors: string[];
  // toggleColorVisibility: (color: string) => void;
  // isColorVisible: (color: string | undefined) => boolean;
}

const ConfContext = createContext<ConfContextType >({
  config: getDefaultConfig(),
  profile: getDefaultProfile(),
  updateConfig: function (config: AppConfig): void {
    throw new Error('Function not implemented.')
  },
  updateProfile: function (profile: Profile): void {
    throw new Error('Function not implemented.')
  },
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

type ConfProviderProps = ConfContextType & {
  children: ReactNode;
}

export function ConfProvider ({ children, config, profile, updateConfig, updateProfile }: ConfProviderProps) {
  // Initialize visibleColors based on the isActive property in etiquettes
  const value:ConfContextType = {
    config,
    profile,
    updateConfig: function (config: AppConfig): void {
      throw new Error('Function not implemented.')
    },
    updateProfile: function (profile: Profile): void {
      throw new Error('Function not implemented.')
    },
  }

  return (
    <ConfContext.Provider value={value}>
      {children}
    </ConfContext.Provider>
  )
}
