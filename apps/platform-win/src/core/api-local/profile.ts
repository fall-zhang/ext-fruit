import { DEFAULT_PROFILE_NAME } from '@/config/const/profile'
import { v4 as uuid } from 'uuid'

export interface ProfileID {
  id: string
  name: string
}

export function updateActiveProfileID (activeProfile: string) {

}

export function getDefaultProfileID (id?: string): ProfileID {
  return {
    id: id || uuid(),
    name: DEFAULT_PROFILE_NAME,
  }
}

export function removeProfile (id: string) {
  return ''
}
