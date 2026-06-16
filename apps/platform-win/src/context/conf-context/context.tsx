import { createContext, useContext } from 'react'
import { getDefaultProfile, type AppProfile } from '@/config/trans-profile'
import { getDefaultConfig, type AppConfig } from '@/config/app-config'


export interface ConfContextType {
  config: AppConfig
  // 应用翻译相关的配置
  profile: AppProfile
  // Date management
  // appDisable: boolean;
  updateConfig(config: AppConfig): void
  updateProfile(profile: AppProfile): void
  // // Etiquette visibility management
  // visibleColors: string[];
  // toggleColorVisibility: (color: string) => void;
  // isColorVisible: (color: string | undefined) => boolean;
}
function notImplement () {
  throw new Error('Function not implemented.')
}

// 应用配置的 context
export const ConfContext = createContext<ConfContextType>({
  config: getDefaultConfig(),
  profile: getDefaultProfile(),
  updateConfig: notImplement,
  updateProfile: notImplement,
})

export function useConfContext () {
  const context = useContext(ConfContext)
  if (context === undefined) {
    console.log('you are using original conf context')
  }
  return context
}
