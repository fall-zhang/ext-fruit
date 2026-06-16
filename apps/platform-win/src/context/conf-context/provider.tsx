import type { ReactNode } from 'react'
import { getDefaultProfile, type AppProfile } from '@/config/trans-profile'
import { getDefaultConfig, type AppConfig } from '@/config/app-config'
import { ConfContext, type ConfContextType } from './context'

type ConfProviderProps = Partial<ConfContextType> & {
  children: ReactNode;
}
function notImplement () {
  throw new Error('Function not implemented.')
}
export function ConfProvider ({ children, config, profile, updateConfig, updateProfile }: ConfProviderProps) {
  // Initialize visibleColors based on the isActive property in etiquettes
  const value: ConfContextType = {
    config: config || getDefaultConfig(),
    profile: profile || getDefaultProfile(),
    updateConfig: updateConfig || notImplement,
    updateProfile: updateProfile || notImplement,
  }

  return (
    <ConfContext.Provider value={value}>
      {children}
    </ConfContext.Provider>
  )
}
