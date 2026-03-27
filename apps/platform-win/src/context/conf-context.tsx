import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { getDefaultProfile, type AppProfile } from '@/config/trans-profile'
import { getDefaultConfig, type AppConfig } from '@/config/app-config'

interface ConfContextType {
  config: AppConfig
  profile: AppProfile
  darkMode: boolean
  // Date management
  // appDisable: boolean;
  updateConfig(config: AppConfig): void
  updateProfile(profile: AppProfile): void
  // // Etiquette visibility management
  // visibleColors: string[];
  // toggleColorVisibility: (color: string) => void;
  // isColorVisible: (color: string | undefined) => boolean;
}
// 应用配置的 context
const ConfContext = createContext<ConfContextType>({
  config: getDefaultConfig(),
  profile: getDefaultProfile(),
  darkMode: false,
  updateConfig: function (config: AppConfig): void {
    throw new Error('Function not implemented.')
  },
  updateProfile: function (profile: AppProfile): void {
    throw new Error('Function not implemented.')
  },
})

export function useConfContext () {
  const context = useContext(ConfContext)
  if (context === undefined) {
    console.log('you are using original conf context')
  }
  return context
}

type ConfProviderProps = ConfContextType & {
  children: ReactNode;
}

export function ConfProvider ({ children, config, profile, updateConfig, updateProfile }: ConfProviderProps) {
  // Initialize visibleColors based on the isActive property in etiquettes
  const value: ConfContextType = {
    config,
    darkMode: false,
    profile,
    updateConfig,
    updateProfile,
  }

  return (
    <ConfContext.Provider value={value}>
      {children}
    </ConfContext.Provider>
  )
}
