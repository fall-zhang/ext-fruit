import { getDefaultConfig } from '@/config/app-config'
import { getDefaultProfile } from '@/config/trans-profile'
import type { ConfigFileJSON, ProfileFileJSON } from '../types/file-content-type'

export const defaultConfig = (): ConfigFileJSON => {
  return {
    type: 'app-config',
    data: getDefaultConfig(),
  }
}


export const defaultProfile = (): ProfileFileJSON => {
  return {
    type: 'app-profile',
    data: getDefaultProfile(),
  }
}
