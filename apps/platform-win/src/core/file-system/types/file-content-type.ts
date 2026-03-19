import type { AppConfig } from '@/config/app-config'
import type { Profile } from '@/config/trans-profile'

export type FileJSON = {
  type: string
  data: unknown
}

export type ConfigFileJSON = {
  type: 'app-config'
  data: AppConfig
}

export type ProfileFileJSON = {
  type: 'app-profile'
  data: Profile
}

export type WordSaveJSON = {
  type: 'word-save'
  data: any
}
